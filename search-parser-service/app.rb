#!/usr/bin/env ruby
require 'sinatra'
require 'json'
require 'securerandom'
require 'mlibrary_search_parser'

set :bind, '0.0.0.0'
set :port, 4567

set :protection, except: :host_authorization

# CORS — restrict cross-origin browser access to an explicit allowlist.
#
# Configure via the ALLOWED_ORIGINS environment variable as a
# comma-separated list of fully-qualified origins, e.g.:
#   ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
#
# Defaults to the Vite dev server origin so local development works
# out-of-the-box without any configuration.
#
# The request Origin header is checked against the allowlist and, if
# matched, reflected back in Access-Control-Allow-Origin (never a
# wildcard in production).  Requests from unlisted origins receive no
# CORS headers and the browser will block them.
ALLOWED_ORIGINS = begin
  raw = ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:5173')
  raw.split(',').map(&:strip).reject(&:empty?).to_set
end

before do
  origin = request.env['HTTP_ORIGIN']
  if origin && ALLOWED_ORIGINS.include?(origin)
    headers \
      'Access-Control-Allow-Origin'  => origin,
      'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers' => 'Content-Type',
      'Vary'                         => 'Origin'
  end
end

options '*' do
  200
end

# Parser configuration
# search_fields required by parser for field-specific queries (string keys)
# query_fields used by OpenSearch transformer for multi_match (symbol keys)
DEFAULT_QUERY_FIELDS = ['ic_all'].freeze
QUERY_FIELD_NAMES = begin
  configured_fields = ENV['QUERY_FIELDS']&.split(',')&.map(&:strip)&.reject(&:empty?)
  configured_fields.nil? || configured_fields.empty? ? DEFAULT_QUERY_FIELDS : configured_fields
end

# Build search_fields hash with empty config for each field
SEARCH_FIELDS = QUERY_FIELD_NAMES.each_with_object({}) { |field, hash| hash[field] = {} }

PARSER_CONFIG = {
  'search_fields' => SEARCH_FIELDS,  # String key for parser
  :query_fields => QUERY_FIELD_NAMES, # Symbol key for OpenSearch transformer
  :output_format => :opensearch
}.freeze

# Health check endpoint
get '/health' do
  content_type :json
  { status: 'ok' }.to_json
end

# Parse search query endpoint - returns both string and DSL formats
post '/parse' do
  content_type :json
  raw_query = nil  # Initialize to avoid NameError in rescue logging

  request.body.rewind
  payload = JSON.parse(request.body.read)

  # Validate payload structure
  unless payload.is_a?(Hash) && payload.key?('query') && payload['query'].is_a?(String)
    status 400
    return { error: 'Request body must be a JSON object with a query key' }.to_json
  end

  raw_query = payload['query']

  # Generate OpenSearch Query DSL (new capability)
  opensearch_search = MLibrarySearchParser::Search.new(raw_query, PARSER_CONFIG)
  opensearch_dsl = opensearch_search.to_opensearch_query

  # For backward compatibility with existing React client (RsDorDcApp)
  # which expects parsed_query to be a STRING that can be:
  # 1. Tested with regex: /\b(AND|OR|NOT)\b/i.test(parsedQuery)
  # 2. Interpolated into query_string and match queries
  #
  # Generate Solr-format string if available, otherwise use raw query
  parsed_string = begin
    solr_config = PARSER_CONFIG.merge(output_format: :solr)
    solr_search = MLibrarySearchParser::Search.new(raw_query, solr_config)
    solr_search.to_solr
  rescue NoMethodError, NotImplementedError
    # Fallback: if Solr transformer not available, return raw query
    raw_query
  end

  {
    raw_query: raw_query,
    parsed_query: parsed_string,  # String for backward compatibility with existing client
    parsed_query_dsl: opensearch_dsl  # OpenSearch Query DSL — consumed by RsDorDcApp customQuery via buildOpenSearchQuery
  }.to_json
rescue JSON::ParserError => e
  # Log detailed error server-side for debugging
  logger.error "JSON parsing error: #{e.class} - #{e.message}"
  logger.error e.backtrace.first(5).join("\n") if e.backtrace

  # Return generic error to client (avoid leaking internal details)
  status 400
  { error: 'Invalid JSON in request body' }.to_json
rescue => e
  # Log detailed error server-side for debugging
  request_id = SecureRandom.hex(8)
  logger.error "[#{request_id}] Parser error: #{e.class} - #{e.message}"
  logger.error "[#{request_id}] Query: #{raw_query.inspect}" if raw_query  # Guard against nil
  logger.error "[#{request_id}] Backtrace:\n#{e.backtrace.first(10).join("\n")}" if e.backtrace

  # Return generic error to client with request ID for correlation
  status 500
  {
    error: 'Query parsing failed',
    request_id: request_id,
    message: 'An error occurred while parsing the query. Please check your syntax.'
  }.to_json
end


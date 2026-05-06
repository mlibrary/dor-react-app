#!/usr/bin/env ruby
require 'sinatra'
require 'json'
require 'mlibrary_search_parser'

set :bind, '0.0.0.0'
set :port, 4567

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

# Parse search query endpoint - returns OpenSearch Query DSL
post '/parse' do
  content_type :json

  request.body.rewind
  payload = JSON.parse(request.body.read)

  raw_query = payload['query'] || ''

  # Parse to OpenSearch Query DSL
  search = MLibrarySearchParser::Search.new(raw_query, PARSER_CONFIG)
  opensearch_query = search.to_opensearch_query

  {
    raw_query: raw_query,
    parsed_query: opensearch_query
  }.to_json
rescue JSON::ParserError => e
  status 400
  { error: 'Invalid JSON', message: e.message }.to_json
rescue => e
  status 500
  { error: 'Parser error', message: e.message }.to_json
end


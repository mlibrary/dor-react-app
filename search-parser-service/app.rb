#!/usr/bin/env ruby
require 'sinatra'
require 'json'

set :bind, '0.0.0.0'
set :port, 4567

# Health check endpoint
get '/health' do
  content_type :json
  { status: 'ok' }.to_json
end

# Parse search query endpoint
post '/parse' do
  content_type :json

  request.body.rewind
  payload = JSON.parse(request.body.read)

  raw_query = payload['query'] || ''

  # For now, just echo back the input
  # Later, this will contain the actual parsing logic
  {
    raw_query: raw_query,
    parsed_query: raw_query
  }.to_json
end


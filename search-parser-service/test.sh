#!/bin/bash

# Test script for the search parser service
# Tests the OpenSearch Query DSL output functionality

echo "Testing Search Parser Service (OpenSearch Query DSL)"
echo "====================================================="
echo

# Check if the service is running
echo "1. Testing health endpoint..."
curl -s http://localhost:4567/health | python3 -m json.tool
echo
echo

# Test the parse endpoint with a simple query
echo "2. Testing parse endpoint with simple query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"test search"}' | python3 -m json.tool
echo
echo

# Test the parse endpoint with a Boolean query
echo "3. Testing parse endpoint with Boolean query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"michigan AND history NOT war"}' | python3 -m json.tool
echo
echo

# Test with field-specific query
echo "4. Testing parse endpoint with field-specific query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"title:hamlet author:shakespeare"}' | python3 -m json.tool
echo
echo

# Test with phrase query
echo "5. Testing parse endpoint with phrase query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"\"complete works\""}' | python3 -m json.tool
echo
echo

# Test with OR query
echo "6. Testing parse endpoint with OR query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"cats OR dogs"}' | python3 -m json.tool
echo
echo

# Test with complex nested query
echo "7. Testing parse endpoint with complex nested query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"(cats OR dogs) AND NOT birds"}' | python3 -m json.tool
echo
echo

echo "Tests complete!"
echo "All responses contain:"
echo "  - parsed_query: Solr-format string (backward compatible)"
echo "  - parsed_query_dsl: OpenSearch Query DSL object (new capability)"


#!/bin/bash

# Test script for the search parser service
# This script demonstrates how to call the microservice endpoints

echo "Testing Search Parser Service"
echo "=============================="
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

# Test the parse endpoint with a complex query
echo "3. Testing parse endpoint with Boolean query..."
curl -s -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"michigan AND history NOT war"}' | python3 -m json.tool
echo
echo

echo "Tests complete!"


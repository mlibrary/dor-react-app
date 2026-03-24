#!/bin/bash

# Script to create a search template on OpenSearch/ReactiveSearch server
# Usage: ./create-search-template.sh

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
OPENSEARCH_URL="${VITE_REACTIVESEARCH_URL:-https://reactivesearch.discovery.dor.lib.umich.edu}"
CREDENTIALS="${VITE_REACTIVESEARCH_CREDENTIALS:-rs-admin-user:rs-password}"
TEMPLATE_ID="${VITE_SEARCH_TEMPLATE_ID:-dor_search_template}"

echo "Creating search template on OpenSearch..."
echo "URL: ${OPENSEARCH_URL}"
echo "Template ID: ${TEMPLATE_ID}"
echo ""

# Create the search template
curl -X PUT "${OPENSEARCH_URL}/_scripts/${TEMPLATE_ID}" \
  -H "Content-Type: application/json" \
  -u "${CREDENTIALS}" \
  -d '{
    "script": {
      "lang": "mustache",
      "source": {
        "query": {
          "bool": {
            "must": [
              "{{#query}}{{{query}}}{{/query}}{{^query}}{\"match_all\":{}}{{/query}}"
            ],
            "filter": [
              "{{#filters}}{{{.}}}{{^last}},{{/last}}{{/filters}}"
            ]
          }
        },
        "size": "{{size}}{{^size}}10{{/size}}",
        "from": "{{from}}{{^from}}0{{/from}}",
        "aggs": {{{aggs}}}
      }
    }
  }'

echo ""
echo ""
echo "✅ Template created: ${TEMPLATE_ID}"
echo ""
echo "To verify, run:"
echo "curl -X GET \"${OPENSEARCH_URL}/_scripts/${TEMPLATE_ID}\" -u \"${CREDENTIALS}\""
echo ""
echo "To test the template, run:"
echo "curl -X POST \"${OPENSEARCH_URL}/dor-dc/_search/template\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -u \"${CREDENTIALS}\" \\"
echo "  -d '{"
echo "    \"id\": \"${TEMPLATE_ID}\","
echo "    \"params\": {"
echo "      \"query\": {"
echo "        \"multi_match\": {"
echo "          \"query\": \"test\","
echo "          \"fields\": [\"ic_all\"]"
echo "        }"
echo "      },"
echo "      \"size\": 10,"
echo "      \"from\": 0"
echo "    }"
echo "  }'"


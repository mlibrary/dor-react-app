VITE_OPENSEARCH_URL="https://opensearch.discovery.dor.lib.umich.edu"
VITE_OPENSEARCH_CREDENTIALS="admin:CHANGEME"
VITE_REACTIVESEARCH_URL="http://reactivesearch:8000"
VITE_REACTIVESEARCH_CREDENTIALS="admin:password"
VITE_SEARCH_PARSER_URL="http://search-parser:4567"

# OpenSearch index name. Update this when a new date-stamped index is deployed.
# Default (in constants.js): dor-dc-20260513
VITE_OPENSEARCH_INDEX="dor-dc-20260513"

# Comma-separated list of browser origins allowed to call the search-parser
# service via CORS. Set to the deployed front-end origin(s) in production.
# Default (development): http://localhost:5173
ALLOWED_ORIGINS="https://your-deployed-app.example.com"


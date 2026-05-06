# Search Parser Service

A Ruby microservice that parses search query strings and converts them to OpenSearch Query DSL format.

## Purpose

This service receives raw search queries from the React application and returns OpenSearch Query DSL structures that can be sent directly to OpenSearch. It uses the `mlibrary_search_parser` gem to parse user queries with support for:

- Boolean operators (AND, OR, NOT)
- Field-specific searches (e.g., `title:hamlet`)
- Phrase queries (e.g., `"complete works"`)
- Wildcard patterns (e.g., `prog*`)
- Complex nested queries

## API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### `POST /parse`
Parse a search query string and return OpenSearch Query DSL.

**Request:**
```json
{
  "query": "cats AND dogs"
}
```

**Response:**
```json
{
  "raw_query": "cats AND dogs",
  "parsed_query": "cats AND dogs",
  "parsed_query_dsl": {
    "query": {
      "bool": {
        "must": [
          {
            "multi_match": {
              "query": "cats",
              "fields": ["ic_all"],
              "type": "best_fields"
            }
          },
          {
            "multi_match": {
              "query": "dogs",
              "fields": ["ic_all"],
              "type": "best_fields"
            }
          }
        ]
      }
    }
  }
}
```

**Response Fields:**
- `raw_query` (string): The original query as submitted
- `parsed_query` (string): Solr-format query string (backward compatible with existing clients)
- `parsed_query_dsl` (object): OpenSearch Query DSL object (for direct DSL consumption)

**Error Responses:**

Invalid JSON (400):
```json
{
  "error": "Invalid JSON in request body"
}
```

Parser error (500):
```json
{
  "error": "Query parsing failed",
  "request_id": "a1b2c3d4e5f6g7h8",
  "message": "An error occurred while parsing the query. Please check your syntax."
}
```

**Security Note**: Error responses return generic messages to avoid leaking internal implementation details. Detailed error information (exception class, message, backtrace) is logged server-side and can be correlated using the `request_id` for debugging.

## Configuration

### Environment Variables

**`QUERY_FIELDS`** (optional)  
Comma-separated list of OpenSearch field names to search. Must match your OpenSearch index mappings.

Default: `ic_all` (the catch-all field used by this project's OpenSearch indexes)

```bash
# Default (searches ic_all field)
QUERY_FIELDS=ic_all

# Multiple fields (must exist in your OpenSearch mapping)
QUERY_FIELDS=ic_all,title,author,subject
```

**Note**: The field names in `QUERY_FIELDS` must match the actual field names in your OpenSearch index mappings. This project's indexes use `ic_all` as the primary searchable field. See `src/apps/*/utils/constants.js` for the field configuration used by the React application.

**`MLIBRARY_SEARCH_PARSER_GIT`** (required for Docker)  
Git repository URL for the mlibrary_search_parser gem.

```bash
MLIBRARY_SEARCH_PARSER_GIT=https://github.com/mlibrary/mlibrary_search_parser.git
```

**`MLIBRARY_SEARCH_PARSER_REF`** (required for Docker)  
Git ref (branch, tag, or commit SHA) to use for the parser gem.

```bash
MLIBRARY_SEARCH_PARSER_REF=DOR-159/opensearch-query-dsl
```

**Default Configuration:**
- Query fields: `ic_all`
- Parser output: OpenSearch Query DSL format

## Query Examples

### Simple Query
```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"michigan history"}'
```

### Boolean AND
```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"cats AND dogs"}'
```

### Boolean NOT
```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"cats NOT dogs"}'
```

### Field-Specific
**Note**: Field names in queries must match your OpenSearch index mappings. The examples below use generic field names for illustration.

```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"title:hamlet author:shakespeare"}'
```

For this project's OpenSearch indexes, searchable fields are configured via `QUERY_FIELDS` (default: `ic_all`). Field-specific queries like `title:hamlet` require those fields to be both:
1. Listed in the `QUERY_FIELDS` environment variable
2. Defined in your OpenSearch index mappings

### Phrase Query
```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"\"complete works\""}'
```

### Complex Nested
```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"(cats OR dogs) AND NOT birds"}'
```

## Development

### Running Locally

```bash
cd search-parser-service
bundle install
ruby app.rb
```

Service runs on port 4567.

### Running with Docker Compose

```bash
docker compose up -d search-parser
```

Service is accessible at `http://search-parser:4567` from other Docker Compose services.

### Testing

```bash
./test.sh
```

This runs a series of test queries demonstrating various OpenSearch Query DSL outputs.

## Implementation Details

- **Gem**: `mlibrary_search_parser` (git-based dependency via environment variables)
- **Parser Branch**: `DOR-159/opensearch-query-dsl`
- **Output Format**: Dual-format response for compatibility
  - `parsed_query`: Solr-format string (backward compatible with existing React client)
  - `parsed_query_dsl`: OpenSearch Query DSL object (for future direct DSL consumption)
- **Error Handling**: 
  - Returns 400 for invalid JSON, 500 for parser errors
  - Generic error messages to clients (avoids leaking internal details)
  - Detailed errors logged server-side with request IDs for debugging
- **Security**: Exception messages not exposed to clients; full details in server logs
- **Docker Ready**: Uses environment variables for reproducible builds
- **Backward Compatibility**: Existing React clients (`RsDorDcApp`) expect a string query that can be tested with regex and interpolated into OpenSearch queries. The dual-format response maintains compatibility while enabling future DSL-based integrations.

**Note**: If Solr support is not available in the parser gem, set `parsed_query` to `raw_query` as a fallback to maintain backward compatibility with existing clients.


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

**`MLIBRARY_SEARCH_PARSER_GIT`** (optional)  
Git repository URL for the mlibrary_search_parser gem.

Default: `https://github.com/mlibrary/mlibrary_search_parser.git`

```bash
MLIBRARY_SEARCH_PARSER_GIT=https://github.com/mlibrary/mlibrary_search_parser.git
```

**`MLIBRARY_SEARCH_PARSER_REF`** (optional)  
Git ref (branch, tag, or commit SHA) to use for the parser gem.

Default: `DOR-159/opensearch-query-dsl`

```bash
MLIBRARY_SEARCH_PARSER_REF=DOR-159/opensearch-query-dsl
# Or use a specific commit for reproducibility:
MLIBRARY_SEARCH_PARSER_REF=2f9c398
# Or use main after merge:
MLIBRARY_SEARCH_PARSER_REF=main
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

**No configuration required** - the service works out of the box with sensible defaults from the Gemfile:

```bash
cd search-parser-service
bundle install  # No env vars needed - Gemfile has defaults
ruby app.rb
```

The Gemfile uses `ENV.fetch()` with defaults, so `bundle install` will automatically:
- Clone from: `https://github.com/mlibrary/mlibrary_search_parser.git`
- Check out branch: `DOR-159/opensearch-query-dsl`

Service runs on port 4567.

**Customizing the parser gem source** (optional):

```bash
# Use a specific commit:
export MLIBRARY_SEARCH_PARSER_REF=2f9c398
bundle install

# Use main branch after merge:
export MLIBRARY_SEARCH_PARSER_REF=main
bundle install

# Use a fork:
export MLIBRARY_SEARCH_PARSER_GIT=https://github.com/yourfork/mlibrary_search_parser.git
export MLIBRARY_SEARCH_PARSER_REF=your-branch
bundle install
```

### Running with Docker Compose

**No configuration required** - the service builds and runs with defaults from the Gemfile:

```bash
docker compose up -d search-parser
```

The Dockerfile passes through the Gemfile defaults, so the build will automatically use the correct parser gem source and branch.

Service is accessible at `http://search-parser:4567` from other Docker Compose services.

**Customizing the parser gem source** (optional):

```bash
# Set environment variables before building:
export MLIBRARY_SEARCH_PARSER_REF=main
docker compose build search-parser
docker compose up -d search-parser

# Or inline:
MLIBRARY_SEARCH_PARSER_REF=main docker compose up -d --build search-parser
```

### Testing

```bash
./test.sh
```

This runs a series of test queries demonstrating various OpenSearch Query DSL outputs.

## Implementation Details

- **Gem**: `mlibrary_search_parser` (git-based dependency via environment variables)
  - Default: `https://github.com/mlibrary/mlibrary_search_parser.git` @ `DOR-159/opensearch-query-dsl`
  - Override via `MLIBRARY_SEARCH_PARSER_GIT` and `MLIBRARY_SEARCH_PARSER_REF` environment variables
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


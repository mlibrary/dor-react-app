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
  "parsed_query": {
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

## Configuration

### Environment Variables

**`QUERY_FIELDS`** (optional)  
Comma-separated list of fields to search. Default: `ic_all`

```bash
QUERY_FIELDS=ic_all,title,author,subject
```

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
```bash
curl -X POST http://localhost:4567/parse \
  -H "Content-Type: application/json" \
  -d '{"query":"title:hamlet author:shakespeare"}'
```

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
- **Output Format**: OpenSearch Query DSL (JSON)
- **Error Handling**: Returns 400 for invalid JSON, 500 for parser errors
- **Docker Ready**: Uses environment variables for reproducible builds


# Search Parser Service Integration

## Overview

The RsDorDcApp now integrates with the search-parser microservice to transform raw search queries before sending them to OpenSearch. This allows for query expansion, synonym handling, and other preprocessing logic to be centralized in the Ruby microservice.

## How It Works

1. **User enters a search query** in the SearchBox component
2. **Query is sent to the parser service** via `POST /parse` endpoint
3. **Parser service returns a transformed query** (currently just echoes back the input)
4. **Transformed query is used** in the OpenSearch query via ReactiveSearch
5. **Fallback behavior**: If the parser service is unavailable, the raw query is used directly

## Architecture

```
User Input → SearchBox → searchParserService.parseSearchQuery()
                              ↓
                    POST http://search-parser:4567/parse
                              ↓
                    { raw_query, parsed_query }
                              ↓
                    parsedQueryRef.current = parsed_query
                              ↓
                    customQuery() uses parsed_query
                              ↓
                    OpenSearch Query
```

## Configuration

Set the parser service URL in your environment variables:

```bash
# In .env file or env.sh
VITE_SEARCH_PARSER_URL="http://search-parser:4567"
```

Default: `http://localhost:4567`

## Error Handling

- **Parser service unavailable**: Shows a warning alert but continues using raw queries
- **Parser service errors**: Catches exceptions and falls back to raw queries
- **Health check on startup**: Tests parser availability and sets `parserAvailable` flag

## User Feedback

The app displays alerts for parser service status:

- **Warning (yellow)**: Parser service unavailable or error, using raw queries
- **Dismissible**: User can close the warning and continue searching

## Implementation Files

- `src/apps/RsDorDcApp/services/searchParserService.js` - Service client
- `src/apps/RsDorDcApp/index.jsx` - Integration in main component
- `search-parser-service/` - Ruby microservice
- `compose.yaml` - Docker service configuration

## Testing

1. **With parser service running**:
   ```bash
   docker compose up -d search-parser
   npm run dev
   # Search should work normally with parsing
   ```

2. **Without parser service**:
   ```bash
   docker compose stop search-parser
   npm run dev
   # Search should still work with raw queries + warning
   ```

3. **Test parser directly**:
   ```bash
   cd search-parser-service
   ./test.sh
   ```

## Future Enhancements

The parser service can be enhanced to:

- Expand abbreviations and acronyms
- Apply synonym substitution
- Handle special field syntax (e.g., `title:foo`, `author:bar`)
- Add query validation and sanitization
- Support custom query templates
- Apply institution-specific transformations


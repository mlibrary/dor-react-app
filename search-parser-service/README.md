# Search Parser Service

A Ruby microservice that parses search query strings before they are sent to ReactiveSearch/OpenSearch.

## Purpose

This service receives raw search queries from the React application and returns parsed/transformed queries that are optimized for OpenSearch. Currently, it's a stub implementation that echoes back the input.

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
Parse a search query string.

**Request:**
```json
{
  "query": "raw search string"
}
```

**Response:**
```json
{
  "raw_query": "raw search string",
  "parsed_query": "raw search string"
}
```

## Development

The service runs on port 4567 and is accessible at `http://search-parser:4567` from other Docker Compose services.

## Future Enhancements

- Add query expansion logic
- Add synonym handling
- Add field-specific query parsing
- Add query validation and sanitization


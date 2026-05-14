# Search Parser Service Integration

## Overview

The RsDorDcApp integrates with the search-parser microservice to transform raw
search queries into OpenSearch Query DSL before sending them to OpenSearch via
ReactiveSearch. This centralises query parsing, Boolean logic, and field-specific
syntax handling in the Ruby microservice.

## How It Works

1. **User types a search query** in the SearchBox component
2. **`onValueChange` fires on every keystroke** → `handleSearchChange` is called
3. **Query is sent to the parser service** via `POST /parse`
4. **Parser service returns** a dual-format response:
   - `parsed_query`: Solr-format string (kept for backward-compatibility fallback)
   - `parsed_query_dsl`: OpenSearch Query DSL object (used directly as `customQuery`)
5. **`customQuery` callback** calls `buildOpenSearchQuery()`, which uses `parsed_query_dsl`
   when it is a non-empty object, falling back to manual DSL construction from the
   Solr-format string otherwise
6. **ReactiveSearch** sends the resulting DSL to OpenSearch
7. **Fallback**: if the parser service is unreachable, the raw query is used directly
   and a dismissible warning alert is shown

## Architecture

```
User types
    ↓
SearchBox onValueChange → handleSearchChange(value)
    ↓
parseSearchQuery(value)  [searchParserService.js]
    ↓
POST http://search-parser:4567/parse
    ↓
{ raw_query, parsed_query, parsed_query_dsl }
    ↓
parsedQueryRef.current     = parsed_query     (Solr string, fallback)
parsedQueryDslRef.current  = parsed_query_dsl (OpenSearch DSL object)
    ↓
customQuery(value, props) → buildOpenSearchQuery(parsedQuery, parsedQueryDsl, dataFields)
    ↓
OpenSearch Query DSL → ReactiveSearch → OpenSearch
```

## Query Examples

Boolean operators are **case-sensitive** — use uppercase `AND`, `OR`, `NOT`:

| User input      | DSL produced                                                  |
|-----------------|---------------------------------------------------------------|
| `michigan`      | `multi_match` on `ic_all`                                     |
| `"great lakes"` | `match_phrase` on `ic_all`                                    |
| `greg AND bill` | `bool/must` with two `multi_match` terms                      |
| `cats OR dogs`  | `bool/should` with two `multi_match` terms                    |
| `cats NOT dogs` | `bool/must_not`                                               |
| `greg and bill` | `multi_match` — lowercase `and` is a search term, not Boolean |

## Configuration

### Environment variable

```bash
VITE_SEARCH_PARSER_URL="http://search-parser:4567"
```

Default (when variable is unset): `http://localhost:4567`

In Docker Compose the service name `search-parser` resolves automatically.
For local development outside Docker, override the URL without modifying the
committed `.env` file:

```bash
# .env.local  (gitignored — never committed)
VITE_SEARCH_PARSER_URL=http://localhost:4567
```

Vite loads `.env.local` automatically and it takes priority over `.env`.

### Parser fields

The fields searched by the parser are controlled by the `QUERY_FIELDS`
environment variable on the parser service (default: `ic_all`):

```yaml
# compose.yaml
environment:
  - QUERY_FIELDS=${QUERY_FIELDS:-ic_all}
```

## Local Development Setup

```bash
# Terminal 1 — start the parser service
docker compose up -d search-parser

# Terminal 2 — start the Vite dev server
# (ensure .env.local exists with VITE_SEARCH_PARSER_URL=http://localhost:4567)
npm run dev
```

Verify the parser is healthy:
```bash
curl http://localhost:4567/health
# → {"status":"ok"}
```

Test a query directly:
```bash
curl -s -X POST http://localhost:4567/parse \
  -H 'Content-Type: application/json' \
  -d '{"query":"michigan AND history"}' | python3 -m json.tool
```

## Supported OpenSearch Query Types

- `multi_match` — single term or lowercase-and phrase
- `match_phrase` — quoted strings (e.g. `"great lakes"`)
- `bool/must` — `AND` (uppercase)
- `bool/should` — `OR` (uppercase)
- `bool/must_not` — `NOT` (uppercase)
- Nested Boolean combinations

## Error Handling

- **Parser service unreachable**: `checkParserHealth()` returns `false` on startup →
  `parserAvailable` is set to `false` → `handleSearchChange` skips the parse call →
  raw query is used → yellow warning alert shown (dismissible)
- **Parse call fails mid-session**: fallback to raw query; warning alert shown
- **`parsed_query_dsl` is `{}` or `null`**: `buildOpenSearchQuery` falls through to
  manual DSL construction from the Solr-format `parsed_query` string

## Implementation Files

| File                                                  | Purpose                                                         |
|-------------------------------------------------------|-----------------------------------------------------------------|
| `src/apps/RsDorDcApp/services/searchParserService.js` | HTTP client — `parseSearchQuery`, `checkParserHealth`           |
| `src/apps/RsDorDcApp/utils/queryBuilder.js`           | `buildOpenSearchQuery` — DSL-first with fallback                |
| `src/apps/RsDorDcApp/index.jsx`                       | `handleSearchChange`, `parsedQueryDslRef`, `customQuery` wiring |
| `search-parser-service/app.rb`                        | Sinatra service — `/health`, `/parse`, CORS headers             |
| `search-parser-service/Dockerfile`                    | Builds the service image; uses `bundle exec ruby app.rb`        |
| `compose.yaml`                                        | Orchestrates `app` + `search-parser` services                   |

## Known Gotchas

### `onValueChange` vs `onChange` on ReactiveSearch SearchBox

ReactiveSearch's `SearchBox` calls `onChange` **only in controlled mode** (when you also
pass a `value` prop). In uncontrolled mode (no `value` prop) typing fires the internal
`setValue` path, which calls `onValueChange`. Always use `onValueChange` to hook into
search-as-you-type behaviour:

```jsx
// ✅ correct — fires on every keystroke in uncontrolled mode
<SearchBox onValueChange={handleSearchChange} ... />

// ❌ wrong — never fires without a `value` prop
<SearchBox onChange={handleSearchChange} ... />
```

### CORS

The parser service must return CORS headers so the browser can call it directly.
`app.rb` checks the request `Origin` header against an explicit allowlist and
reflects the matched origin in `Access-Control-Allow-Origin` (never a wildcard).
Requests from unlisted origins receive no CORS headers and are blocked by the browser.

Configure the allowlist via the `ALLOWED_ORIGINS` environment variable
(comma-separated, fully-qualified origins). Defaults to `http://localhost:5173`
for local development:

```bash
# production
ALLOWED_ORIGINS=https://discovery.dor.lib.umich.edu

# multiple origins
ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
```

Any reverse-proxy in front of the service must preserve (or re-set) CORS headers.

## Testing

**With parser service running:**
```bash
docker compose up -d search-parser
npm run dev
# Search should work with DSL queries; no warning banner
```

**Without parser service:**
```bash
docker compose stop search-parser
npm run dev
# Search still works with raw queries; yellow warning banner appears
```

**Parser unit tests (Ruby):**
```bash
cd search-parser-service
./test.sh
```

**React unit tests:**
```bash
npm run test
# 26 tests — searchParserService + queryBuilder
```

## Future Enhancements

The parser service can be enhanced to:

- Expand abbreviations and acronyms
- Apply synonym substitution
- Handle special field syntax (e.g., `title:foo`, `author:bar`)
- Add query validation and sanitization
- Support custom query templates
- Apply institution-specific transformations

# DOR-159 Status

## Last Updated
2026-05-13 — Tasks 1–4 complete; 26/26 tests passing, lint clean; awaiting Task 5 (E2E verification)

## Current Branch
`DOR-159/react-opensearch-integration` (new branch from `main`)

## Open Tasks

### Task 5: End-to-End Verification and Documentation
**Status**: Not started
Key files:
- `search-parser-service/INTEGRATION.md`
- `src/apps/RsDorDcApp/index.jsx`
- `src/apps/RsDorDcApp/services/searchParserService.js`

## Completed Tasks
- ✅ Task 1: Audited search parser integration in RsDorDcApp
- ✅ Task 2: Vitest suite — 26 tests (12 service + 14 queryBuilder)
- ✅ Task 3: Implemented DSL-based customQuery (queryBuilder.js + index.jsx)
- ✅ Task 4: GitHub Actions CI workflow for search-parser-service Docker build

## Open Plans
| File                          | Purpose                                              | Status   |
| ----------------------------- | ---------------------------------------------------- | -------- |
| plans/integration-analysis.md | Parser architecture analysis and integration options | Complete |

## Recent Activity
- 2026-05-13: Ticket reopened on new branch `DOR-159/react-opensearch-integration`
- 2026-05-13: Task 1 — Audited `searchParserService.js` and `index.jsx` customQuery flow
- 2026-05-13: Task 2 — Set up Vitest; wrote 26 tests (Red phase)
- 2026-05-13: Task 3 — Implemented:
  - `searchParserService.js`: added `parsedQueryDsl` field (from `parsed_query_dsl ?? null`)
  - `src/apps/RsDorDcApp/utils/queryBuilder.js`: new helper, uses DSL when available else manual fallback
  - `src/apps/RsDorDcApp/index.jsx`: `parsedQueryDslRef`, updated `handleSearchChange`, replaced 80-line inline customQuery with `buildOpenSearchQuery()`
  - ESLint config updated with test-file overrides
- 2026-05-13: Task 4 — Created `.github/workflows/build-search-parser-service-image.yaml`
- 2026-05-13: All work committed (c953b87), 26/26 tests, 0 lint errors

## Key Context
- **Phase 1 delivered** (branch `DOR-159/query-parser-microservice`, now merged):
  - mlibrary_search_parser gem: OpenSearch transformer at `transform/opensearch/query_dsl.rb`
  - search-parser-service `/parse` returns dual-format JSON:
    - `parsed_query`: Solr-format string (backward compat with existing React client)
    - `parsed_query_dsl`: OpenSearch Query DSL object (now consumed in Phase 2)
- **Phase 2 key design decisions:**
  - `buildOpenSearchQuery(queryString, parsedQueryDsl, dataFields)` — DSL takes priority
    over manual construction only when it is a non-empty object
  - Empty object `{}` treated as "no DSL" and falls through to manual construction
  - All fallback paths set `parsedQueryDslRef.current = null`
  - `parsedQueryRef.current` (Solr string) kept as the fallback query value passed to
    `buildOpenSearchQuery` so the manual DSL path still works correctly
- **CI workflow** uses `vars.MLIBRARY_SEARCH_PARSER_GIT` / `vars.MLIBRARY_SEARCH_PARSER_REF`
  repository variables with hardcoded defaults (same as Dockerfile ARGs) so it works
  out-of-the-box with no GitHub configuration required.

## Next Steps
1. **Task 5**: Spin up the full stack (docker compose up) and test search queries end-to-end.
2. Update `search-parser-service/INTEGRATION.md` to document the `parsedQueryDsl` client-side
   consumption pattern if useful for future integrators.
3. Ask developer to verify Task 5 and confirm all tasks complete.

# DOR-159 Status

## Last Updated
2026-05-13 — Ticket reopened for Phase 2: React OpenSearch DSL integration

## Current Branch
`DOR-159/react-opensearch-integration` (new branch from `main`)

Phase 1 work lives on the merged branch `DOR-159/query-parser-microservice`.

## Open Tasks

### Task 1: Audit Current RsDorDcApp Search Parser Integration
**Status**: Not started
Key files:
- `src/apps/RsDorDcApp/services/searchParserService.js`
- `src/apps/RsDorDcApp/index.jsx` (customQuery callback, parsedQueryRef)

### Task 2: Write Tests for OpenSearch DSL Integration (TDD)
**Status**: Not started
Key files (to be created):
- `src/apps/RsDorDcApp/services/__tests__/searchParserService.test.js`
- Test harness for `customQuery` logic

### Task 3: Implement DSL-Based customQuery in RsDorDcApp
**Status**: Not started
Key files:
- `src/apps/RsDorDcApp/services/searchParserService.js`
- `src/apps/RsDorDcApp/index.jsx`

### Task 4: Create GitHub Actions Workflow to Build the Docker Image
**Status**: Not started
Key files (to be created):
- `.github/workflows/search-parser-service-build.yml`
Key files to read first:
- `search-parser-service/Dockerfile`
- `compose.yaml`

### Task 5: End-to-End Verification and Documentation
**Status**: Not started
Key files:
- `search-parser-service/INTEGRATION.md`
- Inline comments in src files

## Open Plans
| File                          | Purpose                                              | Status   |
| ----------------------------- | ---------------------------------------------------- | -------- |
| plans/integration-analysis.md | Parser architecture analysis and integration options | Complete |

## Recent Activity
- 2026-05-13: Ticket reopened on new branch `DOR-159/react-opensearch-integration`
- 2026-05-13: Moved `archive/DOR-159` → `tasks/DOR-159`
- 2026-05-13: Replaced Phase 1 TODO.md with Phase 2 tasks
- 2026-05-13: Added Task 4 — GitHub Actions workflow to build search-parser-service image

## Key Context
- **Phase 1 delivered** (branch `DOR-159/query-parser-microservice`, now merged):
  - mlibrary_search_parser gem: OpenSearch transformer at `transform/opensearch/query_dsl.rb`
  - search-parser-service `/parse` returns dual-format JSON:
    - `parsed_query`: Solr-format string (backward compat with existing React client)
    - `parsed_query_dsl`: OpenSearch Query DSL object (new, for Phase 2 consumption)
- **Current React state**: `RsDorDcApp` uses `parsedQueryRef.current` (a string) in
  `customQuery` to build its own `query_string` / `bool` OpenSearch query manually.
- **Phase 2 goal**: Replace that manual DSL construction with the `parsed_query_dsl`
  object returned directly by the parser service.
- Service runs on port 4567 in Docker (`http://search-parser:4567`).
- `searchParserService.js` currently reads `parsed_query` (string) from the response.

## Next Steps
1. **Start Task 1**: Read `searchParserService.js` and trace `parsedQueryRef` usage
   in `index.jsx` to build a clear picture of what needs to change.
2. Plan the test structure for Task 2 before writing any code.
3. Ask developer to approve TODO.md plan before starting Task 2 / 3 work.

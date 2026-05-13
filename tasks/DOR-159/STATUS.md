# DOR-159 Status

## Last Updated
2026-05-13 — E2E verified: POST /parse returning 200, parsed_query_dsl flowing into ReactiveSearch customQuery

## Current Branch
`DOR-159/react-opensearch-integration` (new branch from `main`)

## Open Tasks

### Task 5: End-to-End Verification and Documentation
**Status**: Integration verified; documentation + developer sign-off remaining
Key files:
- `search-parser-service/INTEGRATION.md`
- `src/apps/RsDorDcApp/index.jsx`
- `src/apps/RsDorDcApp/services/searchParserService.js`

Remaining subtasks:
- [ ] Update `search-parser-service/INTEGRATION.md`
- [ ] Update inline comments if needed
- [ ] Developer verification

## Completed Tasks
- ✅ Task 1: Audited search parser integration in RsDorDcApp
- ✅ Task 2: Vitest suite — 26 tests (12 service + 14 queryBuilder)
- ✅ Task 3: Implemented DSL-based customQuery (queryBuilder.js + index.jsx)
- ✅ Task 4: GitHub Actions CI workflow for search-parser-service Docker build
- ✅ Task 5 (partial): Local E2E verified — POST /parse 200, DSL flowing through

## Open Plans
| File                          | Purpose                                              | Status   |
| ----------------------------- | ---------------------------------------------------- | -------- |
| plans/integration-analysis.md | Parser architecture analysis and integration options | Complete |

## Recent Activity
- 2026-05-13: Tasks 1–4 implemented and committed (c953b87)
- 2026-05-13: Task 5 E2E — fixed three bugs:
  1. Dockerfile CMD: `ruby app.rb` → `bundle exec ruby app.rb` (d635f65)
  2. gem `query_parser.rb`: wrapped `require "pry"` in begin/rescue LoadError; pushed to GitHub (3355251)
  3. `package-lock.json` regenerated for darwin-arm64 (d635f65)
- 2026-05-13: Fixed CORS: added `before` filter + OPTIONS route to `app.rb` (441b6e4)
- 2026-05-13: Fixed event wiring: `onChange` → `onValueChange` on SearchBox (437e8ea)
  - Root cause: ReactiveSearch SearchBox only calls `onChange` in controlled mode (when `value` prop is set);
    uncontrolled mode fires `onValueChange` from its internal `setValue` path
- 2026-05-13: E2E confirmed — browser → POST /parse (200) → parsed_query_dsl → ReactiveSearch → OpenSearch

## Key Context
- **Phase 2 key design decisions:**
  - `buildOpenSearchQuery(queryString, parsedQueryDsl, dataFields)` — DSL takes priority
    over manual construction only when it is a non-empty object
  - Empty object `{}` treated as "no DSL" and falls through to manual construction
  - All fallback paths set `parsedQueryDslRef.current = null`
- **Local E2E setup** (for this machine):
  - `docker compose up -d search-parser` → parser at http://localhost:4567
  - `npm run dev` → Vite at http://localhost:5173
  - `.env.local` sets `VITE_SEARCH_PARSER_URL=http://localhost:4567`
- **Gemfile.lock** for search-parser-service is gitignored; local copy has SHA `3355251d93c26de5e7b6224cfd97469334c814ae`
- **ReactiveSearch SearchBox gotcha**: use `onValueChange` (not `onChange`) in uncontrolled mode

## Next Steps
1. Update `search-parser-service/INTEGRATION.md` with client-side consumption notes and local dev setup
2. Review inline comments in `index.jsx` for accuracy
3. Ask developer to verify Task 5 and confirm all tasks complete

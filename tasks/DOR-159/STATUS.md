# DOR-159 Status

## Last Updated
2026-05-13 — All tasks complete, developer signed off, DONE.md updated, ready for PR

## Current Branch
`DOR-159/react-opensearch-integration` (new branch from `main`)

## Open Tasks
None — all tasks complete.

## Completed Tasks
- ✅ Task 1: Audited search parser integration in RsDorDcApp
- ✅ Task 2: Vitest suite — 26 tests (12 service + 14 queryBuilder)
- ✅ Task 3: Implemented DSL-based customQuery (queryBuilder.js + index.jsx)
- ✅ Task 4: GitHub Actions CI workflow for search-parser-service Docker build
- ✅ Task 5: E2E verified, INTEGRATION.md rewritten, inline comments cleaned up, developer signed off

## Open Plans
None.

## Recent Activity
- 2026-05-13: All Task 5 subtasks complete — E2E verified, docs updated, comments fixed
- 2026-05-13: Developer signed off
- 2026-05-13: DONE.md updated with Phase 2 summary

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
- **Gemfile.lock** for search-parser-service is gitignored; local copy pinned to gem commit `3355251`
- **ReactiveSearch SearchBox gotcha**: use `onValueChange` (not `onChange`) in uncontrolled mode

## Next Steps
1. **Create PR**: `DOR-159/react-opensearch-integration` → `main`
2. **After PR merges**: on `agents` branch, run `git mv tasks/DOR-159 archive/DOR-159` and update `tasks/README.md`

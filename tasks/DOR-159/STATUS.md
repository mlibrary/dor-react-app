# DOR-159 Status

## Last Updated
2026-05-13 — E2E verification in progress; two bugs fixed; parser service and Vite dev server now both running

## Current Branch
`DOR-159/react-opensearch-integration` (new branch from `main`)

## Open Tasks

### Task 5: End-to-End Verification and Documentation
**Status**: In progress — services running, browser verification pending
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
- 2026-05-13: Tasks 1–4 implemented and committed (c953b87); 26/26 tests, 0 lint errors
- 2026-05-13: Task 5 E2E setup — two bugs found and fixed:
  - **Bug 1**: `search-parser-service/Dockerfile` CMD was `ruby app.rb` without `bundle exec`
    → gems in `/usr/local/bundle` were not activated → fixed to `bundle exec ruby app.rb`
  - **Bug 2**: `mlibrary_search_parser/lib/mlibrary_search_parser/query_parser.rb` had
    unconditional `require "pry"` → LoadError in production (pry excluded by `--without development test`)
    → wrapped in `begin/rescue LoadError`; committed & pushed to `DOR-159/opensearch-query-dsl`
    branch on GitHub (commit 3355251); local `search-parser-service/Gemfile.lock` updated to new SHA
    (Gemfile.lock is gitignored in search-parser-service but correct on disk)
  - **Bug 3**: `package-lock.json` was generated on wrong platform → missing `@rollup/rollup-darwin-arm64`
    → deleted node_modules + package-lock.json and ran `npm install` fresh on darwin-arm64
- 2026-05-13: Committed Dockerfile fix + new package-lock.json (d635f65)
- 2026-05-13: Created `.env.local` with `VITE_SEARCH_PARSER_URL=http://localhost:4567`
  (gitignored via `*.local`; overrides Docker hostname for local dev)
- 2026-05-13: Parser service verified working — health, simple, boolean AND, phrase queries all return correct `parsed_query_dsl`
- 2026-05-13: Vite dev server running at http://localhost:5173

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
- **Local E2E setup** (for this machine):
  - `docker compose up -d search-parser` → parser at http://localhost:4567
  - `npm run dev` → Vite at http://localhost:5173
  - `.env.local` sets `VITE_SEARCH_PARSER_URL=http://localhost:4567`
- **Gemfile.lock** for search-parser-service is gitignored (by `search-parser-service/.gitignore`);
  local copy on disk has SHA `3355251d93c26de5e7b6224cfd97469334c814ae` (the pry fix commit)

## Next Steps
1. **Browser verification**: Open http://localhost:5173, run a search, open DevTools → Network tab,
   confirm POST to http://localhost:4567/parse returns `parsed_query_dsl`, and ReactiveSearch
   uses it as the customQuery.
2. **Update INTEGRATION.md**: Document the `parsedQueryDsl` client-side consumption pattern
   and the local dev setup (`.env.local` + `docker compose up search-parser`).
3. **Ask developer** to verify Task 5 is complete, then close out the ticket.

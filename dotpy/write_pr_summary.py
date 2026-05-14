#!/usr/bin/env python3
"""Write the DOR-159 Phase 2 PR summary to pr-summary.md.

Usage: python3 dotpy/write_pr_summary.py
"""

content = """\
## DOR-159 Phase 2: Wire RsDorDcApp to consume `parsed_query_dsl` from the search-parser service

### Summary

This PR completes Phase 2 of the DOR-159 OpenSearch integration. The `RsDorDcApp`
now sends every search query to the `search-parser-service` microservice and uses
the returned `parsed_query_dsl` OpenSearch Query DSL object directly as the
ReactiveSearch `customQuery`, replacing the previous Solr-string-based fallback
path. A full set of unit tests (29 passing) and a rewritten `INTEGRATION.md`
accompany the implementation. Several issues discovered during end-to-end testing
are also resolved (CORS allowlist, per-keystroke debouncing, gem lock file
tracking, and Dockerfile startup).

### Changes

**`src/apps/RsDorDcApp/utils/queryBuilder.js`** *(new file)*
- `buildOpenSearchQuery(value, parsedQueryDsl, dataFields)` helper
- DSL-first: returns `parsedQueryDsl` directly when it is a non-empty object
- Falls back to the existing manual DSL construction (Solr-string path) otherwise

**`src/apps/RsDorDcApp/services/searchParserService.js`**
- `parseSearchQuery` maps `result.parsed_query_dsl` to `parsedQueryDsl` field
- Accepts an optional `{ signal }` (AbortSignal) forwarded to `fetch`;
  `AbortError` is re-thrown so callers can distinguish cancellation from service failure
- Both fallback paths (HTTP error, network failure) return `parsedQueryDsl: null`

**`src/apps/RsDorDcApp/utils/__tests__/queryBuilder.test.js`** *(new file)*
- 14 Vitest tests: DSL pass-through, fallback construction, edge cases

**`src/apps/RsDorDcApp/services/__tests__/searchParserService.test.js`**
- 15 Vitest tests: `parsedQueryDsl` field, fallback paths, signal forwarding,
  AbortError re-throw, no `console.error` for aborts (29 total across both suites)

**`src/apps/RsDorDcApp/index.jsx`**
- Added `parsedQueryDslRef` to carry DSL from `onValueChange` into `customQuery`
- Replaced 80-line inline `customQuery` with `buildOpenSearchQuery()`
- Switched `onChange` to `onValueChange` on `SearchBox` (fixes silent no-op in
  uncontrolled mode — root cause of parse calls never firing)
- Debounced `handleSearchChange` (300 ms) with `AbortController` to cancel
  superseded in-flight requests, preventing request bursts and stale-DSL race conditions
- Removed stale debug comment

**`search-parser-service/app.rb`**
- CORS: replaced `Access-Control-Allow-Origin: *` with an explicit allowlist;
  reads `ALLOWED_ORIGINS` env var (comma-separated, defaults to `http://localhost:5173`);
  reflects the matched origin with `Vary: Origin`; unlisted origins get no CORS headers
- Updated stale inline comment on `parsed_query_dsl` response field

**`search-parser-service/Dockerfile`**
- Fixed `CMD` from `ruby app.rb` to `bundle exec ruby app.rb` so Bundler-installed
  gems are activated at runtime

**`search-parser-service/Gemfile.lock`** *(now tracked in git)*
- Removed `Gemfile.lock` from `search-parser-service/.gitignore` so the lock file
  is present on the host when the directory is volume-mounted at runtime;
  pins `mlibrary_search_parser` to commit `3355251`

**`search-parser-service/INTEGRATION.md`**
- Full rewrite: updated architecture diagram, query examples table, local dev setup,
  known gotchas (`onValueChange` vs `onChange`; CORS allowlist config)

**`compose.yaml` / `.devcontainer/compose.yaml`**
- Added `ALLOWED_ORIGINS` env var to the `search-parser` service definition

**`env.template.sh`**
- Added `ALLOWED_ORIGINS` with production placeholder and explanatory comment

**`.github/workflows/build-search-parser-service-image.yaml`** *(new file)*
- CI workflow: builds the `search-parser-service` Docker image on every push/PR
  touching `search-parser-service/**`; build-only, no push to registry

**`package-lock.json`**
- Regenerated on darwin-arm64 to resolve missing `@rollup/rollup-darwin-arm64` binary

**`tasks/DOR-159/`**
- `TODO.md`, `STATUS.md`, `DONE.md` updated for Phase 2 completion and sign-off

### Notes

- The CI workflow's `MLIBRARY_SEARCH_PARSER_REF` defaults to `DOR-159/opensearch-query-dsl`.
  Once that gem branch merges to `main`, update the default to `main` (or a release tag).
- For production: set `ALLOWED_ORIGINS=https://your-app-origin.example.com` on the
  `search-parser` service — no code change required.
- `RsDorDcApp/utils/constants.js` exports `COLLECTION_OPTIONS` and `PRICE_RANGE` that
  appear to be unused leftovers from an earlier prototype — worth a separate cleanup ticket.
"""

with open("pr-summary.md", "w") as f:
    f.write(content)

print("pr-summary.md updated.")

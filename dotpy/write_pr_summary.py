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
path. A full set of unit tests (26 passing) and a rewritten `INTEGRATION.md`
accompany the implementation.

### Changes

**`src/apps/RsDorDcApp/utils/queryBuilder.js`** *(new file)*
- `buildOpenSearchQuery(value, parsedQueryDsl, dataFields)` helper
- DSL-first: returns `parsedQueryDsl` directly when it is a non-empty object
- Falls back to the existing manual DSL construction (Solr-string path) otherwise

**`src/apps/RsDorDcApp/services/searchParserService.js`**
- `parseSearchQuery` now maps `result.parsed_query_dsl` to `parsedQueryDsl` field
- Both fallback paths (HTTP error, network failure) return `parsedQueryDsl: null`

**`src/apps/RsDorDcApp/utils/__tests__/queryBuilder.test.js`** *(new file)*
- 14 Vitest tests covering DSL pass-through, fallback construction, and edge cases

**`src/apps/RsDorDcApp/services/__tests__/searchParserService.test.js`**
- 12 Vitest tests (extended) covering the new `parsedQueryDsl` field and fallback paths

**`src/apps/RsDorDcApp/index.jsx`**
- Added `parsedQueryDslRef` to store the DSL between `onValueChange` and `customQuery`
- Replaced 80-line inline `customQuery` with a call to `buildOpenSearchQuery()`
- Switched `onChange` to `onValueChange` on `SearchBox` (fixes silent no-op in uncontrolled mode)
- Removed stale debug comment

**`search-parser-service/app.rb`**
- Added CORS `before` filter and `OPTIONS *` route so the browser can call the service directly
- Updated stale inline comment on `parsed_query_dsl` response field

**`search-parser-service/Dockerfile`**
- Fixed `CMD` from `ruby app.rb` to `bundle exec ruby app.rb` so Bundler-installed gems are activated at runtime

**`search-parser-service/INTEGRATION.md`**
- Full rewrite: updated architecture diagram, query examples table, local dev setup,
  known gotchas (`onValueChange` vs `onChange`, CORS)

**`.github/workflows/build-search-parser-service-image.yaml`** *(new file)*
- CI workflow that builds the `search-parser-service` Docker image on every push/PR
  touching `search-parser-service/**`; build-only (no push)

**`package-lock.json`**
- Regenerated on darwin-arm64 to include the correct `@rollup/rollup-darwin-arm64` native binary

**`tasks/DOR-159/`**
- `TODO.md`, `STATUS.md`, `DONE.md` updated to reflect Phase 2 completion and developer sign-off

### Notes

- The `search-parser-service/Gemfile.lock` is gitignored by `search-parser-service/.gitignore`;
  the local copy on disk pins gem commit `3355251` (fix for an unconditional `require "pry"` in
  `mlibrary_search_parser/query_parser.rb` that caused a `LoadError` in production). That fix
  was pushed to the `DOR-159/opensearch-query-dsl` branch of the gem repo.
- The CI workflow's `MLIBRARY_SEARCH_PARSER_REF` defaults to `DOR-159/opensearch-query-dsl`.
  Once that gem branch is merged to `main`, the default should be updated to `main` (or a tag).
- `RsDorDcApp/utils/constants.js` exports `COLLECTION_OPTIONS` and `PRICE_RANGE` that appear
  to be unused leftovers — worth a separate cleanup ticket.
"""

with open("pr-summary.md", "w") as f:
    f.write(content)

print("pr-summary.md written.")


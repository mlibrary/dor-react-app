# DOR-159: React OpenSearch Integration (Phase 2)

Consume the OpenSearch Query DSL produced by the search-parser-service inside
RsDorDcApp, replacing the current Solr-string-based query path with a proper
OpenSearch Query DSL path.

Continuing from the completed Phase 1 work (query-parser-microservice branch),
which delivered:
- mlibrary_search_parser OpenSearch transformer
- search-parser-service /parse endpoint returning dual-format response
  (`parsed_query` Solr string for backward compat, `parsed_query_dsl` DSL object)

## Task 1: Audit Current RsDorDcApp Search Parser Integration
Understand exactly how RsDorDcApp currently uses the search-parser-service before
making any changes.

- [x] Read `src/apps/RsDorDcApp/services/searchParserService.js` end-to-end
- [x] Read `src/apps/RsDorDcApp/index.jsx` — trace how `parsedQuery` / `parsedQueryRef` is used in `customQuery`
- [x] Document the current flow: raw input → parser service → customQuery
- [x] Identify all code paths that would be affected by switching to DSL
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 2: Write Tests for OpenSearch DSL Integration (TDD)
Write tests that define the expected behavior before changing any production code.

- [x] Decide on a test framework / approach for the React side (Vitest + jsdom)
- [x] Write unit tests for `searchParserService.js` covering the `parsed_query_dsl` field
- [x] Write tests for the `customQuery` callback in `RsDorDcApp/index.jsx` using DSL input
- [x] Write integration/smoke tests that verify the end-to-end search path (mock service)
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 3: Implement DSL-Based customQuery in RsDorDcApp
Update the React app to use `parsed_query_dsl` from the parser service.

- [x] Update `searchParserService.js` to extract and expose `parsed_query_dsl`
- [x] Update `customQuery` callback in `RsDorDcApp/index.jsx` to use DSL object directly
- [x] Preserve backward compatibility fallback (raw query) when parser unavailable
- [x] Run `npm run lint | cat` and fix any lint errors
- [x] Verify all tests pass
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 4: Create GitHub Actions Workflow to Build the Docker Image
Add a CI workflow that builds the `search-parser-service` Docker image on every
push / pull request so broken builds are caught automatically.

- [x] Examine `search-parser-service/Dockerfile` and `compose.yaml` to understand build args needed
- [x] Create `.github/workflows/build-search-parser-service-image.yaml`
  - Trigger on push and pull_request for paths under `search-parser-service/**`
  - Use `docker/build-push-action` (or plain `docker build`) to build the image
  - Pass `MLIBRARY_SEARCH_PARSER_GIT` and `MLIBRARY_SEARCH_PARSER_REF` build args (use defaults from Dockerfile)
  - Do not push to a registry — build-only is sufficient for CI
- [x] Verify the workflow file is valid YAML and the job name / step names are clear
- [x] Run `npm run lint | cat` to confirm no JS lint regressions
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

## Task 5: End-to-End Verification and Documentation
Verify the full stack works and update documentation.

- [ ] Test the integration locally (dev server + search-parser-service)
- [ ] Verify search results are correct for simple, Boolean, field-specific queries
- [ ] Update `search-parser-service/INTEGRATION.md` if client-side notes are needed
- [ ] Update any inline comments in `RsDorDcApp/index.jsx` / `searchParserService.js`
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete

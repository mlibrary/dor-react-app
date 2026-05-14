# DOR-158: Search Evaluation UI Fixes — COMPLETED

**Completed**: 2026-05-14

## Summary

All four tasks for DOR-158 are complete:

1. **Timestamp Field Removal** (prior session): Confirmed already removed in commit efc354f.
2. **Sticky Filter Bug Fix** (prior session): Fixed in commit 60b4717 via "Clear All Filters" button.
3. **Unicode Display Fix** (prior session): Fixed via DOMPurify sanitization decoding HTML entities.
4. **Add parsed_query to Google Form**: New "Parsed Query" field added to feedback form,
   prepopulated from the parser service's normalized query string (`entry.579946332`).
   Form Index Version field now tracks the active index name automatically.
   Index name is configurable via `VITE_OPENSEARCH_INDEX` (no image rebuild required).

## Completed Tasks

### Task 1: Remove Redundant Timestamp Field ✅
- [x] All subtasks complete — commit efc354f

### Task 2: Fix Sticky Collection Filter Bug ✅
- [x] All subtasks complete — commit 60b4717

### Task 3: Fix Unicode Display Problem ✅
- [x] All subtasks complete — DOMPurify added to RsDorDcApp

### Task 4: Add parsed_query to Google Form Feedback ✅
- [x] New "Parsed Query" field added to Google Form (field entry ID: `entry.579946332`)
- [x] `generateFeedbackFormUrl` updated to append `parsedQueryRef.current`
- [x] Graceful fallback when parser unavailable (uses raw query)
- [x] Fixed entry ID (item ID 1929209268 ≠ field entry ID 579946332)
- [x] Index name moved to `REACTIVESEARCH_CONFIG.index` via `VITE_OPENSEARCH_INDEX`
- [x] Index Version form field now uses index name automatically
- [x] Updated index to `dor-dc-20260513`
- [x] Fixed all "Solr-format" references → correct OpenSearch/normalized terminology
- [x] Verified with developer ✅

## Key Files Changed (this session)

- `src/apps/RsDorDcApp/index.jsx` — `generateFeedbackFormUrl`, `ReactiveBase app=`, index version field
- `src/apps/RsDorDcApp/utils/constants.js` — added `index` to `REACTIVESEARCH_CONFIG`
- `src/apps/RsDorDcApp/services/searchParserService.js` — terminology fix
- `src/apps/RsDorDcApp/utils/queryBuilder.js` — terminology fix
- `search-parser-service/INTEGRATION.md` — terminology fix
- `search-parser-service/README.md` — terminology fix
- `env.template.sh` — documented `VITE_OPENSEARCH_INDEX`
- `dotpy/write_commit_msg.py` — fixed hardcoded stale message (now reads from stdin)

## Outcome

All three reported UI issues have been resolved. The search evaluation interface now:
- Does not redundantly prepopulate timestamps (Google Forms handles this)
- Provides easy filter clearing via "Clear All Filters" button
- Properly displays Unicode characters in search results with HTML entity decoding
- Maintains XSS protection through DOMPurify sanitization

# DOR-158 Status

## Last Updated
2026-05-14 — All tasks complete; developer verified; ready for PR

## Current Branch
`DOR-158/add-parsed-query-to-form`

## Open Tasks
✅ All tasks complete

## Open Plans
| File              | Purpose | Status |
|-------------------|---------|--------|
| *(no open plans)* |         |        |

## Recent Activity
- 2026-05-14: Ticket reopened; restored from archive/DOR-158 to tasks/DOR-158
- 2026-05-14: Added Task 4 — Add parsed_query to Google Form feedback
- 2026-05-14: Created working branch `DOR-158/add-parsed-query-to-form`
- 2026-05-14: Implemented entry.579946332 in generateFeedbackFormUrl
- 2026-05-14: Fixed all "Solr-format" references → OpenSearch/normalized terminology
- 2026-05-14: Fixed write_commit_msg.py — hardcoded stale message, now reads from stdin
- 2026-05-14: Updated index to dor-dc-20260513; made configurable via VITE_OPENSEARCH_INDEX
- 2026-05-14: Index Version form field now uses REACTIVESEARCH_CONFIG.index automatically
- 2026-05-14: Fixed entry ID (was item ID 1929209268, correct field entry ID is 579946332)
- 2026-05-14: Developer verified — form fields correct, boolean queries return results

## Key Context
- `entry.579946332` is the Google Form field entry ID for "Parsed Query" (NOT the item ID 1929209268)
- `VITE_OPENSEARCH_INDEX` env var controls both the ReactiveBase index and the form Index Version field
- Default index: `dor-dc-20260513`

## Next Steps
1. Create PR from `DOR-158/add-parsed-query-to-form` → `main`
2. After merge, archive ticket: `git mv tasks/DOR-158 archive/DOR-158`
3. Update tasks/README.md to move DOR-158 from Active to Archived
4. Commit archival on agents branch

## Current Branch
`DOR-158/add-parsed-query-to-form`

## Open Tasks
### Task 4: Add parsed_query to Google Form Feedback
- [x] Add a new "Parsed Query" field to the Google Form — entry ID: `entry.1929209268`
- [x] Update `generateFeedbackFormUrl` to append `parsedQueryRef.current` using `entry.1929209268`
- [x] Handle parser-unavailable fallback gracefully (falls back to raw query value)
- [x] Fix incorrect "Solr-format" references in comments and docs (commit 811ade3)
- [ ] Verify prepopulated field appears correctly in the form for simple and boolean queries
- [ ] Verify with the developer that the task is complete

## Open Plans
| File              | Purpose | Status |
|-------------------|---------|--------|
| *(no open plans)* |         |        |

## Recent Activity
- 2026-05-14: Ticket reopened; restored from archive/DOR-158 to tasks/DOR-158
- 2026-05-14: Added Task 4 — Add parsed_query to Google Form feedback
- 2026-05-14: Created working branch `DOR-158/add-parsed-query-to-form`
- 2026-05-14: Implemented entry.1929209268 in generateFeedbackFormUrl (commit ac2e6c4)
- 2026-05-14: Fixed all "Solr-format" references → "OpenSearch"/"normalized query string" across src/, search-parser-service/, and task docs (commit 811ade3)
- 2026-05-14: Fixed write_commit_msg.py — was hardcoded with stale message, now reads from stdin

## Key Context
- `entry.579946332` is the Google Form **field entry ID** for "Parsed Query" (item ID 1929209268 ≠ field entry ID — the entry ID is nested in data-params, not data-item-id)
- `parsedQueryRef.current` holds the parser service's normalized query string (set in `handleSearchChange`)
- Fallback: if parser is unavailable, `parsedQueryRef.current` equals the raw query string, so the field always has a value
- Code change is in `generateFeedbackFormUrl` in `src/apps/RsDorDcApp/index.jsx` — added 5 lines after the top-5 results block

## Next Steps
1. Developer tests the live form: run a search (simple + boolean), click the feedback button, verify "Parsed Query" field is prepopulated correctly
2. Check off the verification subtask in TODO.md
3. Merge to main

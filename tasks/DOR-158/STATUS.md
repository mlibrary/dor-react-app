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


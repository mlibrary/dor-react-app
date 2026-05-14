# DOR-158 Status

## Last Updated
2026-05-14 — Corrected all Solr-format references to OpenSearch terminology across src/ and docs/

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
- `entry.1929209268` is the Google Form field ID for the new "Parsed Query" paragraph field
- `parsedQueryRef.current` holds the parser service's normalized query string (set in `handleSearchChange`)
- Fallback: if parser is unavailable, `parsedQueryRef.current` equals the raw query string, so the field always has a value
- Code change is in `generateFeedbackFormUrl` in `src/apps/RsDorDcApp/index.jsx` — added 5 lines after the top-5 results block

## Next Steps
1. Developer tests the live form: run a search (simple + boolean), click the feedback button, verify "Parsed Query" field is prepopulated correctly
2. Check off the verification subtask in TODO.md
3. Merge to main

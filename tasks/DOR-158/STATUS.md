# DOR-158 Status

## Last Updated
2026-05-14 — Implemented Task 4: parsed_query now prepopulated in Google Form (entry.1929209268)

## Current Branch
`DOR-158/add-parsed-query-to-form`

## Open Tasks
### Task 4: Add parsed_query to Google Form Feedback
- [x] Add a new "Parsed Query" field to the Google Form — entry ID: `entry.1929209268`
- [x] Update `generateFeedbackFormUrl` to append `parsedQueryRef.current` using `entry.1929209268`
- [x] Handle parser-unavailable fallback gracefully (falls back to raw query value)
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
- 2026-05-14: Implemented — added `entry.1929209268` (Parsed Query) to `generateFeedbackFormUrl`; falls back to raw query when parser unavailable; all 29 tests pass

## Key Context
- `entry.1929209268` is the Google Form field ID for the new "Parsed Query" paragraph field
- `parsedQueryRef.current` holds the parser service's normalized query string (set in `handleSearchChange`)
- Fallback: if parser is unavailable, `parsedQueryRef.current` equals the raw query string, so the field always has a value
- Code change is in `generateFeedbackFormUrl` in `src/apps/RsDorDcApp/index.jsx` — added 5 lines after the top-5 results block

## Next Steps
1. Developer tests the live form: run a search (simple + boolean), click the feedback button, verify "Parsed Query" field is prepopulated correctly
2. Check off the verification subtask in TODO.md
3. Merge to main

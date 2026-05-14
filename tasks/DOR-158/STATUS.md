# DOR-158 Status

## Last Updated
2026-05-14 — Added Task 4: Add parsed_query to Google Form feedback

## Current Branch
`main` (DOR-158/ui-bug-fixes was merged; work continues on main or a new branch TBD)

## Open Tasks
### Task 4: Add parsed_query to Google Form Feedback
Key files:
- `src/apps/RsDorDcApp/index.jsx` — `generateFeedbackFormUrl` (lines ~99–171), `parsedQueryRef` (line 63)

- [ ] Add a new "Parsed Query" field to the Google Form (needs a new `entry.*` ID)
- [ ] Update `generateFeedbackFormUrl` to append `parsedQueryRef.current` using the new entry ID
- [ ] Handle parser-unavailable fallback gracefully
- [ ] Verify prepopulated field appears correctly in the form
- [ ] Verify with the developer that the task is complete

## Open Plans
| File              | Purpose | Status |
|-------------------|---------|--------|
| *(no open plans)* |         |        |

## Recent Activity
- 2026-05-14: Ticket reopened; restored from archive/DOR-158 to tasks/DOR-158
- 2026-05-14: Added Task 4 — Add parsed_query to Google Form feedback

## Key Context
- Original three tasks (timestamp removal, sticky filter fix, Unicode fix) were all completed and merged
- `parsedQueryRef.current` is already maintained in `RsDorDcApp/index.jsx` (line 63) — it stores the Solr-format parsed string returned by the parser service
- `generateFeedbackFormUrl` (lines ~99–171) currently prepopulates: UUID identifier, index version, raw query + active filters, top-5 result titles
- A new Google Form field must be created first to get its `entry.*` ID before the code can be updated
- Bill Dueber confirmed `ic_all` is the correct catch-all search field

## Next Steps
1. Developer creates a new "Parsed Query" field in the Google Form and provides the `entry.*` ID
2. Update `generateFeedbackFormUrl` to append `parsedQueryRef.current` with the new entry ID
3. Handle graceful fallback when parser is unavailable
4. Test and verify with developer

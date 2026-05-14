# DOR-158: Search Evaluation UI Fixes

This ticket addresses three UI issues reported for the search evaluation interface.

## Task 1: Remove Redundant Timestamp Field from Form
Remove the timestamp field from the Google Form feedback integration as it's redundant.

- [x] Identify timestamp field in the feedback form implementation
- [x] Remove timestamp field from form prepopulation code
- [x] Update documentation to reflect removal of timestamp field
- [x] Test feedback form to ensure it still works correctly
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

**Status**: Complete - Timestamp field was already removed in commit efc354f. Google Forms automatically adds timestamps, making explicit timestamp prepopulation redundant.

## Task 2: Fix Sticky Collection Filter Bug on New Search
Investigate and fix the bug where collection filters remain active (sticky) when performing a new search.

- [x] Reproduce the sticky collection filter bug
- [x] Identify the root cause in the filter state management
- [x] Implement fix to clear/reset filters appropriately on new search
- [x] Test that filters work correctly with new searches
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

**Status**: Complete - Fixed in commit 60b4717 by adding "Clear All Filters" button that resets all filter states.

## Task 3: Fix Unicode Display Problem
Investigate and fix Unicode character display issues in search results.

- [x] Identify where Unicode display problems occur (search results, titles, etc.)
- [x] Determine root cause (encoding, sanitization, rendering)
- [x] Implement fix to properly display Unicode characters
- [x] Test with various Unicode characters (accents, symbols, non-Latin scripts)
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete

**Status**: Complete - Fixed by adding DOMPurify sanitization that properly decodes HTML entities into Unicode characters.

## Task 4: Add parsed_query to Google Form Feedback
Add the parser service's `parsed_query` (the Solr-format normalized string) as a
prepopulated field in the Google Form feedback URL, so evaluators can see how the
search engine interpreted the user's raw query alongside the top-5 results.

Background: the parser service already returns `parsed_query` (e.g. `"greg AND bill"`)
and it is stored in `parsedQueryRef.current` in `RsDorDcApp/index.jsx`. The value
is distinct from the raw user input when boolean operators, field queries, or other
transformations are applied by the parser. Bill Dueber confirmed `ic_all` is the
correct catch-all field.

- [ ] Add a new "Parsed Query" field to the Google Form (needs a new `entry.*` ID)
- [ ] Update `generateFeedbackFormUrl` in `src/apps/RsDorDcApp/index.jsx` to append
      `parsedQueryRef.current` to the form URL using the new entry ID
- [ ] Handle the case where the parser is unavailable (fall back gracefully — omit the
      field or send the raw query as the parsed query)
- [ ] Verify the prepopulated field appears correctly in the Google Form for both
      simple queries and boolean/transformed queries
- [ ] Verify with the developer that the task is complete


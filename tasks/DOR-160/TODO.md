# DOR-160: Add Format and Subclass Facets

Add `dc_format` and `subclass` as filter facets in `RsDorDcApp`.
Note: "Type" (`collection_type.facet`) is already a facet in the app.
"Group" (`group_name.facet`) is also already present.

## Task 1: Add Format and Subclass Facets

Index fields confirmed present in `dor-dc-20260513`:
- `dc_format.facet` — keyword subfield, suitable for CollapsibleMultiList
- `subclass` — root-level keyword field (not a `.facet` subfield); use directly for aggregations

- [x] Add `dc_format.facet` as a new "Format" CollapsibleMultiList filter in `index.jsx`
- [x] Add `subclass` (root keyword field) as a new "Subclass" CollapsibleMultiList filter in `index.jsx`
- [x] Wire both new filters into all `react: { and: [...] }` arrays (search, all existing filters, results)
- [x] Add state and handler (handleFormatChange, handleSubclassChange) for both filters
- [x] Add both filters to the clearAllFilters reset
- [x] Add both to the generateFeedbackFormUrl active-filter summary
- [x] Run lint and tests
- [x] Verify the current state of the project achieves the task goal
      Note: Subclass facet shows "No options" because no documents in dor-dc-20260513
      have subclass values yet — confirmed via direct OpenSearch aggregation query.
      Code is correct; data will populate on next reindex.
- [x] Verify with the developer that the task is complete


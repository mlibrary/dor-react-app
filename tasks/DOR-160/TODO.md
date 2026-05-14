# DOR-160: Add Format and Subclass Facets

Add `dc_format` and `subclass` as filter facets in `RsDorDcApp`.
Note: "Type" (`collection_type.facet`) is already a facet in the app.
"Group" (`group_name.facet`) is also already present.

## Task 1: Add Format and Subclass Facets

Index fields confirmed present in `dor-dc-20260513`:
- `dc_format.facet` — keyword subfield, suitable for CollapsibleMultiList
- `subclass.facet` — keyword subfield, suitable for CollapsibleMultiList

- [x] Add `dc_format.facet` as a new "Format" CollapsibleMultiList filter in `index.jsx`
- [x] Add `subclass.facet` as a new "Subclass" CollapsibleMultiList filter in `index.jsx`
- [x] Wire both new filters into all `react: { and: [...] }` arrays (search, all existing filters, results)
- [x] Add state and handler (handleFormatChange, handleSubclassChange) for both filters
- [x] Add both filters to the clearAllFilters reset
- [x] Add both to the generateFeedbackFormUrl active-filter summary
- [x] Run lint and tests
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete


# DOR-160: Add Format and Subclass Facets

Add `dc_format` and `subclass` as filter facets in `RsDorDcApp`.
Note: "Type" (`collection_type.facet`) is already a facet in the app.
"Group" (`group_name.facet`) is also already present.

## Task 1: Add Format and Subclass Facets

Index fields confirmed present in `dor-dc-20260513`:
- `dc_format.facet` — keyword subfield, suitable for CollapsibleMultiList
- `subclass.facet` — keyword subfield, suitable for CollapsibleMultiList

- [ ] Add `dc_format.facet` as a new "Format" CollapsibleMultiList filter in `index.jsx`
- [ ] Add `subclass.facet` as a new "Subclass" CollapsibleMultiList filter in `index.jsx`
- [ ] Wire both new filters into all `react: { and: [...] }` arrays (search, all existing filters, results)
- [ ] Add state and handler (handleFormatChange, handleSubclassChange) for both filters
- [ ] Add both filters to the clearAllFilters reset
- [ ] Add both to the generateFeedbackFormUrl active-filter summary
- [ ] Run lint and tests
- [ ] Verify the current state of the project achieves the task goal
- [ ] Verify with the developer that the task is complete


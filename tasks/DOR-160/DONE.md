# DOR-160 — DONE

**Completed:** 2026-05-14

## Summary

Added Format (`dc_format.facet`) and Subclass (`subclass`) as `CollapsibleMultiList`
filter facets in `RsDorDcApp`. Both facets are fully wired into all `react: { and: [...] }`
arrays, integrated with state management, `clearAllFilters`, and the feedback form URL
generator.

**Note on Subclass:** The `subclass` field in `dor-dc-20260513` is a root-level `keyword`
type (not `text` + `.facet`). The initial implementation used `dataField="subclass.facet"`;
this was corrected to `dataField="subclass"`. The facet shows "No options" because no
documents in the current index have `subclass` values yet — confirmed via direct OpenSearch
aggregation query. The facet will populate automatically on next reindex.

## Completed Checklist

- [x] Add `dc_format.facet` as a new "Format" CollapsibleMultiList filter in `index.jsx`
- [x] Add `subclass` as a new "Subclass" CollapsibleMultiList filter in `index.jsx`
- [x] Wire both new filters into all `react: { and: [...] }` arrays (search, all existing filters, results)
- [x] Add state and handler (handleFormatChange, handleSubclassChange) for both filters
- [x] Add both filters to the clearAllFilters reset
- [x] Add both to the generateFeedbackFormUrl active-filter summary
- [x] Run lint and tests (29/29 pass, lint clean)
- [x] Verify the current state of the project achieves the task goal
- [x] Verify with the developer that the task is complete


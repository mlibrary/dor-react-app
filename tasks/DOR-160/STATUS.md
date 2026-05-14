# DOR-160 Status

## Last Updated
2026-05-14 — Fixed Subclass facet: switched dataField from `subclass.facet` to `subclass`

## Current Branch
`DOR-160/add-format-subclass-facets`

## Open Tasks
### Task 1: Add Format and Subclass Facets
- [x] Add `dc_format.facet` as "Format" CollapsibleMultiList
- [x] Add `subclass` as "Subclass" CollapsibleMultiList (root keyword field)
- [x] Wire into all `react: { and: [...] }` arrays
- [x] Add state, handlers, clearAllFilters, generateFeedbackFormUrl
- [x] Lint and tests pass (29/29)
- [ ] Verify with developer

## Recent Activity
- 2026-05-14: Branch created; plan recorded in TODO.md
- 2026-05-14: Implementation complete — 29/29 tests pass, lint clean
- 2026-05-14: Fixed Subclass "No options" bug — `subclass` is a root keyword field (not text+.facet); switched dataField to `subclass`


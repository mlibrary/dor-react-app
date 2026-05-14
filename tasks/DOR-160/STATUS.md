# DOR-160 Status

## Last Updated
2026-05-14 — Branch created, plan recorded, awaiting developer approval

## Current Branch
`DOR-160/add-format-subclass-facets`

## Open Tasks
### Task 1: Add Format and Subclass Facets
Key files:
- `src/apps/RsDorDcApp/index.jsx` — all filter wiring
- `docs/dor-dc-20260513-mapping.json` — confirmed field availability

- [ ] Add `dc_format.facet` as "Format" CollapsibleMultiList
- [ ] Add `subclass.facet` as "Subclass" CollapsibleMultiList
- [ ] Wire into all `react: { and: [...] }` arrays
- [ ] Add state, handlers, clearAllFilters, generateFeedbackFormUrl
- [ ] Verify with developer

## Open Plans
| File | Purpose | Status |
|------|---------|--------|
| *(none)* | | |

## Recent Activity
- 2026-05-14: Branch created; plan recorded in TODO.md

## Key Context
- `dc_format.facet` is the correct field (not `collection_format`, which has no `.facet` subfield)
- `subclass.facet` is a keyword field with a pre-built `.facet` subfield
- "Type" (`collection_type.facet`) and "Group" (`group_name.facet`) are already facets — no changes needed there
- All new filters must be added to: CollapsibleMultiList, all `react` arrays, filter state, clearAllFilters, generateFeedbackFormUrl

## Next Steps
1. Await developer approval of the plan in TODO.md
2. Implement all subtasks
3. Run lint + tests
4. Verify with developer


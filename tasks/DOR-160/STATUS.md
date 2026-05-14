# DOR-160 Status

## Last Updated
2026-05-14 — All tasks complete; PR summary written; ready to merge

## Current Branch
`DOR-160/add-format-subclass-facets`

## Open Tasks
All subtasks complete — see `DONE.md`.

## Recent Activity
- 2026-05-14: Branch created; plan recorded in TODO.md
- 2026-05-14: Implementation complete — 29/29 tests pass, lint clean
- 2026-05-14: Fixed Subclass "No options" bug — `subclass` is a root keyword field (not text+.facet); switched dataField to `subclass`
- 2026-05-14: Confirmed via direct OpenSearch aggregation query that `subclass` field has no data yet in dor-dc-20260513; expected to populate on next reindex
- 2026-05-14: Developer sign-off received; DONE.md created; PR summary written

## Key Context
- `subclass` in the mapping is `type: keyword` at the root (unlike all other facet fields which are `text` + `.facet` keyword subfield). Use `dataField="subclass"`, not `"subclass.facet"`.
- Subclass facet correctly shows "No options" — zero documents in dor-dc-20260513 have subclass values. Will auto-populate on next reindex.
- Format facet (`dc_format.facet`) works as expected.

## Next Steps
- Merge PR into main once approved.
- After merge, archive ticket: `git mv tasks/DOR-160 archive/DOR-160` on the `agents` branch, update `tasks/README.md`.



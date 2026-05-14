# Task Index

Reference for the `tasks/` directory layout. For the full agent workflow and
rules, see [`AGENTS.md`](../AGENTS.md).

---

## Active Tasks

| Ticket  | Branch                             | Summary                                           |
|---------|------------------------------------|---------------------------------------------------|
| DOR-160 | DOR-160/add-format-subclass-facets | Add Format (dc_format) and Subclass facet filters |

---

## Archived Tasks

| Ticket  | Archive path    | Summary                                                                                                |
|---------|-----------------|--------------------------------------------------------------------------------------------------------|
| DOR-158 | archive/DOR-158 | Add parsed_query to feedback form; configurable index; groupName→group_name rename (merged 2026-05-14) |
| DOR-159 | archive/DOR-159 | Phase 2: Wire RsDorDcApp to consume parsed_query_dsl from parser service (merged 2026-05-14)           |

---

## Directory Convention

Each Jira ticket gets a subdirectory under `tasks/`:

```
tasks/
  DOR-nnn/
    TODO.md      ← subtask checklist (follow AGENTS.md § Task Tracking format)
    STATUS.md    ← living session snapshot (follow AGENTS.md § Session State format)
    DONE.md      ← created when all subtasks complete; retained when archived
    plans/
      *.md       ← design docs, summaries, and plan files for this ticket
```

**Starting a new ticket:**
1. `mkdir -p tasks/DOR-nnn/plans`
2. Create `tasks/DOR-nnn/TODO.md` and `tasks/DOR-nnn/STATUS.md`.
3. Add a row to the Active Tasks table above.
4. Work entirely within `tasks/DOR-nnn/` for all agent state and plans.

**Completing a ticket (after PR merges):**
1. `git mv tasks/DOR-nnn archive/DOR-nnn`
2. Move the row from Active to Archived in this file.
3. Commit on the `agents` branch.


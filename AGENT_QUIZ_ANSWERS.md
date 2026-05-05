# Agent Onboarding Quiz Answers — dor-react-app

> **Grading instructions (for developer):**
> Compare the agent's answers against this file. Each answer should demonstrate that the
> agent actually read the referenced files in context (not relied on memory or guesses).
> Minor wording differences are fine — look for conceptual understanding.

---

## Section 1 — Ground Rules (AGENTS.md)

**A1.** Record the plan in `tasks/DOR-nnn/TODO.md` first before beginning execution, so that work is always resumable. After recording the plan, ask the developer to review it and wait for explicit approval before starting any work.

*(Source: `AGENTS.md` § Task Tracking — "Before executing any multi-step plan, record it in `TODO.md` first. Do not begin execution until the plan is recorded so work is always resumable." and "After recording a plan, ask the developer to review it before starting any work. Wait for explicit approval before proceeding with implementation.")*

---

**A2.** Must use Python (regex split and list manipulation); must **never** use string-search-and-replace.

*(Source: `AGENTS.md` § Reordering Subtasks — example code provided using `re.split()` and list operations)*

---

**A3.** Create a new commit on top of HEAD instead (never use `git commit --amend`). The developer will squash or amend manually.

*(Source: `AGENTS.md` § Git Commits — "Never amend existing commits. Always create a new commit on top of the current HEAD using `git commit`…")*

---

**A4.** zsh mangles multi-line quoted strings passed to `-c` flags, triggering heredoc mode and corrupting the terminal. The universal fix is: (1) write the code to a file (under `dotpy/` or `/tmp/`), (2) run the file (`python3 dotpy/script.py | cat` or `python3 /tmp/run.py | cat`).

*(Source: `AGENTS.md` § Command-Line Tool Usage — "Never pass multi-line code via `-c` flags… The universal fix — write to a file, run the file")*

---

**A5.** First run `python3 dotpy/format_table.py <file.md>` to auto-format, then run `python3 dotpy/check_tables.py <file.md>` to validate.

*(Source: `AGENTS.md` § Markdown Formatting — "To auto-format a table… run: `python3 dotpy/format_table.py <file.md>`… To validate alignment after editing, run: `python3 dotpy/check_tables.py <file.md>`")*

---

**A6.** `npm run lint | cat`

*(Source: `AGENTS.md` § React / Node.js / Vite Conventions — "Before committing, run: `npm run lint | cat`")*

---

## Section 2 — Project Structure and Build

**A7.** Vite (build tool and dev server).

*(Source: `package.json` scripts (`"dev": "vite"`, `"build": "vite build"`); `AGENTS.md` § React / Node.js / Vite Conventions)*

---

**A8.** `npm run dev` starts the development server; `npm run build` creates a production build.

*(Source: `package.json` scripts section)*

---

**A9.** `OsDorDcApp` and `RsDorDcApp`.

*(Source: `src/apps/` directory structure)*

---

**A10.** `antd` (Ant Design).

*(Source: `package.json` dependencies)*

---

**A11.** `@appbaseio/reactivesearch` provides search UI components for connecting to Elasticsearch/OpenSearch backends.

*(Source: `package.json` dependencies; `src/apps/OsDorDcApp/services/openSearchService.js` shows it connects to OpenSearch)*

---

**A12.** `src/apps/*/components/` where `*` is the app module name (e.g., `src/apps/OsDorDcApp/components/`).

*(Source: `AGENTS.md` § React / Node.js / Vite Conventions — "Project structure" bullet: `src/apps/*/components/ — React components specific to an app`)*

---

## Section 3 — Application Modules

**A13.** The `OsDorDcApp` component is built as a custom search interface without using a single main ReactiveSearch component. It uses custom components (`SearchBar`, `CollectionFilter`, `ThingCard`) and directly calls the `openSearchService` functions.

*(Note: The code doesn't use a single ReactiveSearch component like `<ReactiveBase>` or `<ReactiveList>`. Instead, it's a custom implementation using the `openSearchService`)*

---

**A14.** Four components: `CollectionFilter.jsx`, `PriceRangeFilter.jsx`, `SearchBar.jsx`, and `ThingCard.jsx`.

*(Source: `src/apps/OsDorDcApp/components/` directory listing)*

---

**A15.** `"ic_all"` (defined in the `SEARCH_FIELDS` array).

*(Source: `src/apps/OsDorDcApp/utils/constants.js` — `export const SEARCH_FIELDS = ["ic_all"];`)*

---

**A16.** `dompurify` is used for HTML sanitization to prevent XSS attacks. You would expect to see it used when rendering user-generated content or HTML from external sources (e.g., sanitizing HTML before using `dangerouslySetInnerHTML` in React).

*(Source: `package.json` dependencies; general React security best practices)*

---

**A17.** `react-router-dom` is used for routing. However, in the current implementation, the routing is commented out and the app directly renders `<RsDorDcApp />`. The commented code shows that `OsDorDcApp` would be rendered at the `/os` route.

*(Source: `src/App.jsx` — the routing code is commented out, but shows `<Route path="/os" element={<OsDorDcApp/>}/>`)*

---

## Section 4 — Active Work and Task Management

**A18.** There is one currently active ticket:
- **DOR-158** (branch: `DOR-158/ui-bug-fixes`): Search Evaluation UI fixes: remove timestamp, fix sticky filters, fix Unicode

*(Source: `tasks/README.md` — Active Tasks table)*

---

**A19.** Steps: (1) `git mv tasks/DOR-nnn archive/DOR-nnn`, (2) Move the row from Active to Archived in `tasks/README.md`, (3) Commit on the `agents` branch. The task directory moves to `archive/DOR-nnn`.

*(Source: `AGENTS.md` § Task Tracking — "Completing a ticket" section; `tasks/README.md` — "Completing a ticket" section)*

---

**A20.** Update `tasks/DOR-nnn/STATUS.md`. Specific sections to update: **Last Updated** (timestamp + one-line summary), **Recent Activity** (bullet list of changes), **Next Steps** (what to do next), and any relevant changes to **Open Tasks**, **Open Plans**, or **Key Context**.

*(Source: `AGENTS.md` § Session State — "At the end of every session" instructions)*

---



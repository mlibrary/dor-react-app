# Agent Onboarding Quiz — dor-react-app

> 🚫 **DO NOT read `AGENT_QUIZ_ANSWERS.md`** until you have written out answers to all
> 21 questions below and the developer has told you to compare. Reading the answer file
> first defeats the purpose of the quiz.
>
> **Instructions for the quiz-taker (agent):**
> Answer every question by looking it up in the actual project files — do not rely on
> memory or training data. Each question includes a hint pointing to the authoritative
> source. Write your answers in your response, then stop and prompt the developer
> (see the instruction after Q20).
>
> **Instructions for the quiz-giver (developer):**
> Run this quiz at the start of a new agent session to confirm the agent has read and
> understood the project state before it begins work. When the agent prompts you after
> Q20, open `AGENT_QUIZ_ANSWERS.md` and grade the answers yourself, or ask the agent
> to read that file and self-grade at that point.

---

## Section 1 — Ground Rules (AGENTS.md)

**Q1.** You are about to start a multi-step task. What must you do *before* executing
the first step, and what must you do after recording the plan?

*(Hint: `AGENTS.md` § Task Tracking)*

---

**Q2.** You need to reorder two subtasks in `tasks/DOR-nnn/TODO.md`. What tool must you use, and what
tool must you **never** use for this operation?

*(Hint: `AGENTS.md` § Reordering Subtasks)*

---

**Q3.** The developer asks you to amend the most recent commit to include a small fix.
What should you do instead?

*(Hint: `AGENTS.md` § Git Commits)*

---

**Q4.** You need to run a short multi-line Python snippet. Your first instinct is to
write `python3 -c "..."`. What is wrong with that approach in this environment, and
what is the universal fix?

*(Hint: `AGENTS.md` § Command-Line Tool Usage)*

---

**Q5.** After editing a Markdown file that contains tables, what two commands should
you run before committing, in order?

*(Hint: `AGENTS.md` § Markdown Formatting)*

---

**Q6.** Before committing changes to JavaScript/JSX source files, what npm command should you run
to check for linting errors? Write the exact command as you would type it in the terminal,
including any suffix needed to ensure output is captured without a pager.

*(Hint: `AGENTS.md` § React / Node.js / Vite Conventions and § Command-Line Tool Usage)*

---

## Section 2 — Project Structure and Build

**Q7.** What build tool and dev server does this project use?

*(Hint: `package.json` scripts; `AGENTS.md` § React / Node.js / Vite Conventions)*

---

**Q8.** What command starts the development server, and what command creates a
production build?

*(Hint: `package.json` scripts)*

---

**Q9.** Name the two application modules in this project (by their directory names under `src/apps/`).

*(Hint: `src/apps/` directory structure)*

---

**Q10.** What UI component library is used in this project? Name the package.

*(Hint: `package.json` dependencies)*

---

**Q11.** What is the purpose of the `@appbaseio/reactivesearch` package in this project?
What type of backend does it connect to?

*(Hint: `package.json` dependencies; `src/apps/OsDorDcApp/services/openSearchService.js`)*

---

**Q12.** Where are React components that are specific to an application module stored?
Give the path pattern.

*(Hint: `AGENTS.md` § React / Node.js / Vite Conventions — Project structure)*

---

## Section 3 — Application Modules

**Q13.** Look at `src/apps/OsDorDcApp/index.jsx`. What main search component from
`@appbaseio/reactivesearch` is used to provide the search interface?

*(Hint: `src/apps/OsDorDcApp/index.jsx`)*

---

**Q14.** In the `OsDorDcApp` module, how many custom filter components are defined
under `src/apps/OsDorDcApp/components/`? Name each one.

*(Hint: `src/apps/OsDorDcApp/components/` directory)*

---

**Q15.** Look at `src/apps/OsDorDcApp/utils/constants.js`. What OpenSearch/Elasticsearch
field is used as the data field for the search query component?

*(Hint: `src/apps/OsDorDcApp/utils/constants.js`)*

---

**Q16.** What is the purpose of the `dompurify` package, and where in the codebase
would you expect to see it used?

*(Hint: `package.json` dependencies; consider what it's commonly used for in React apps)*

---

**Q17.** Look at `src/App.jsx`. What routing library is used, and what is the
route path that renders the `OsDorDcApp` component?

*(Hint: `src/App.jsx`)*

---

## Section 4 — Active Work and Task Management

**Q18.** Look at `tasks/README.md`. List every currently active ticket with its key and a
one-sentence summary of what it is working on.

*(Hint: `tasks/README.md`)*

---

**Q19.** A ticket's PR has been merged to main. What are the steps required to archive the
ticket (on the `agents` branch), and where does the task directory move to?

*(Hint: `AGENTS.md` § Task Tracking — "Completing a ticket" section; `tasks/README.md` — "Completing a ticket" section)*

---

**Q20.** What file should you update at the end of every work session before committing?
Name the file and list all sections that should be updated either during or at the end of the session.

*(Hint: `AGENTS.md` § Session State — "During a session" and "At the end of every session" instructions)*

---

## Section 5 — Environment

**Q21.** At the start of a new session, how do you confirm whether you are inside a
devcontainer? Write the exact shell command to run, name the single most definitive
environment variable to look for, and explain what its value tells you about the *type*
of devcontainer in use in this repository.

*(Hint: `AGENTS.md` § Environment Check)*

---

## When You Have Answered All 21 Questions

Stop here. Do **not** open `AGENT_QUIZ_ANSWERS.md`.

Tell the developer:

> "I have answered all 21 quiz questions. Please open `AGENT_QUIZ_ANSWERS.md` to grade
> my answers, or let me know when I may read it to self-grade."

Wait for the developer's instruction before proceeding.



# How to apply this pack

1. PC1: create a Vite React+TS repository, install dependencies, commit and push initial scaffold to main.
2. PC1: unzip/copy the files in THIS kit at the repository root, preserving docs/ and .github/. Read/approve Visual Bible and Product Flow with the other two operators, then commit and push to main.
3. PC1: invite PC2 and the asset operator on GitHub.
4. PC2: clone AFTER shared docs are merged to main. Each dev creates only their own branch.
5. PC1: run `hermes` inside repo while on feat/shell-story. Explicit first prompt: "Read AGENTS.md and docs/roles/HERMES_A.md plus all linked design/contract docs. Check branch. Before editing, give me a concise plan and file list; then implement the first shell vertical slice, build, and prepare a PR."
6. PC2: run `hermes` inside repo while on feat/interactions. Explicit first prompt: "Read AGENTS.md and docs/roles/HERMES_B.md plus all linked design/contract docs. Check branch. Before editing, give me a concise plan and file list; then implement isolated pointer-reactive Pip and nightlight components with a clean PR."
7. Asset operator: read docs/roles/GEMINI_ASSETS.md, use the official Pip references, human-approve a consistent look, export final filenames into public/assets, and deliver via branch assets/gemini or to PC1 to commit.
8. Integrator: connect GitHub repo to Vercel, deploy main and enable PR preview. Review at 1440x900 and 390x844 before every major merge.
9. Both devs: use git fetch origin && git merge origin/main (after commit) to receive merged work; never force-push shared branches. Since agent branches persist over several PRs, merge PRs using the MERGE COMMIT option, not squash or rebase. Do not delete long-lived branches.

Note: if your repo has a `.hermes.md` or AGENTS.override.md of higher instruction priority, Hermes may not use this root AGENTS.md. Remove contradictory project context or explicitly instruct the agent to read AGENTS.md. Hermes loads context when a new session starts, so restart after changing the rules.

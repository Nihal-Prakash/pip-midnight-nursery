# GitHub integration policy — two PCs + asset operator

## Branches
main = deployed stable production; feat/shell-story = Hermes A; feat/interactions = Hermes B; assets/gemini = approved artwork. Branch from main AFTER the bootstrap + contracts commit.

## PR granularity
PR #1 scaffold / contracts. PR #2 shell skeleton. PR #3 Pip reaction. PR #4 approved first assets. PR #5 nightlight. PR #6 story. PR #7 music + map. PR #8 rest of assets and visual integration. Then defect fixes. Actual split may vary; avoid all-at-once merges.

## Every PR must
- Change only owner files unless coordinated.
- Pass npm ci, npm run lint, npm run build.
- Note which contracts/files changed, relevant UI screens, mobile behavior and regressions.
- Include desktop/mobile screenshots and/or Vercel preview link for visual changes.
- Not include secrets or generated node_modules/dist.

## Integration loop
1. Agent commits to its branch and pushes.
2. Agent creates PR to main.
3. GitHub Actions builds; Vercel creates PR preview.
4. Hermes A reviews functional diff, visual operator reviews screenshot/preview.
5. Merge to main with a REGULAR MERGE COMMIT (`gh pr merge <number> --merge`) after gates pass; main deploys. Because branches are long-lived, do not squash-merge or delete them after each PR.
6. Both PCs refresh branches: git fetch origin && git merge origin/main (commit/clean work first). No force pushing.
7. Continue next slice. Never force-push a shared branch.

## Design review gates
Gate A: style-reference and five-scene wireflow approved before detailed parallel coding.
Gate B: hero and one project integrated before remaining scenes.
Gate C: full mobile journey after all P0 sections.
Gate D: performance, credits, and submission readiness.

## Planned deadlines (IST)
18 Oct 17:17: live P0 deployed target. 19 Oct 13:00: feature freeze. 19 Oct 15:30: submit target. Official submission deadline: 19 Oct 17:17.

## Conflict policy
Never solve a visual conflict by keeping both versions. Resolve to one source-of-truth design. If merge conflicts occur in shared contracts/App/CSS, Hermes A resolves after consulting Hermes B; re-run full QA before merge.

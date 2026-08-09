# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the
codebase. This repo is **single-context**.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest
creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and
`/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

Neither exists yet in this repo. The existing docs under `docs/` (`architecture.md`,
`design-tokens.md`, `data-and-stores.md`, `icons.md`, `verification.md`) and the root `AGENTS.md`
are the current source of truth for structure and conventions — read those too.

## File structure

Single-context repo (this one):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-....md
│   └── 0002-....md
└── src/
```

If this ever becomes a multi-package repo, a root `CONTEXT-MAP.md` would point at one `CONTEXT.md`
per context, with context-scoped ADRs under `src/<context>/docs/adr/`.

## Use the glossary's vocabulary

When your output names a domain concept (in a ticket title, a refactor proposal, a hypothesis, a
test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary
explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing
language the project doesn't use (reconsider) or there's a real gap (note it for
`/domain-modeling`).

The UI Consistency Canon in `AGENTS.md` is the nearest thing this repo already has to a glossary —
`捷運點`, `PointsAmount`, `ContentCard`, `StampBadge` are canonical names. Use them.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_

# Issue tracker: Notion「任務」database

Issues, tickets and PRDs for this repo live in the **任務** task database on the project's Notion
home page — not in GitHub Issues. GitHub is used for code, PRs and CI only.

All operations go through the Notion MCP tools (`mcp__claude_ai_Notion__notion-*`). Never
`gh issue create` — the GitHub issue tracker for this repo is unused.

## Coordinates

| Thing | Value |
| --- | --- |
| Project home (Notion) | https://app.notion.com/p/mpoints-assemble-34ddc169a5ba8088bff0cc4575d4f0a8 |
| 任務 database | https://app.notion.com/p/888dc169a5ba82308100011344e81a3e |
| 任務 data source | `collection://37bdc169-a5ba-835a-b822-0703cde51a5e` |
| 路線圖 (roadmap) data source | `collection://becdc169-a5ba-837e-bd75-07a2c92d7404` |

Re-fetch the data source before writing if it's been a while — the schema below is a snapshot.

## Schema

| Property | Type | Notes |
| --- | --- | --- |
| `任務名稱` | title | Ticket title. Write it in 繁體中文, matching the repo's commit-message convention. |
| `狀態` | status | `未開始` / `進行中` / `完成` / `已封存` |
| `標籤` | multi-select | Topic tags: `行動版` `網頁版` `改進` `行銷` `研究` `品牌` `影像製作` `指標`. Triage labels also live here — see `triage-labels.md`. |
| `優先等級` | select | `高` / `中` / `低` |
| `指派人員` | person | |
| `截止日期` / `完成日期` | date | Use `date:截止日期:start` etc. when writing. |
| `子任務` / `Parent-task` | relation (self) | Parent ↔ child tickets. |
| `阻擋` / `被阻擋` | relation (self) | `被阻擋` = this ticket is blocked by those; `阻擋` = this ticket blocks those. |
| `路線圖項目` | relation → 路線圖 | Link to a roadmap item when one applies. |
| `延遲天數` | formula | Read-only. |

## Conventions

- **Create a ticket**: `notion-create-pages` with
  `parent: { type: "data_source_id", data_source_id: "37bdc169-a5ba-835a-b822-0703cde51a5e" }`.
  Always set `任務名稱`; set `狀態` to `未開始` unless you're creating something already in flight.
  The body goes in `content` (Notion-flavored Markdown).
- **Read a ticket**: `notion-fetch` with the page URL or ID. Add `include_discussions: true` when
  comments matter (they usually do — that's where clarifications land).
- **List tickets**: `notion-query-data-sources` in SQL mode against
  `collection://37bdc169-a5ba-835a-b822-0703cde51a5e`. Example — open tickets ready for an agent:

  ```sql
  SELECT url, "任務名稱", "狀態", "標籤", "優先等級"
  FROM "collection://37bdc169-a5ba-835a-b822-0703cde51a5e"
  WHERE "狀態" IN ('未開始', '進行中')
  ORDER BY "優先等級"
  ```

  `標籤` is a JSON array — filter it with `"標籤" LIKE '%needs-triage%'`.
- **Comment on a ticket**: `notion-create-comment` on the page.
- **Apply / remove labels**: `notion-update-page` with `command: "update_properties"` and the full
  new `標籤` array (multi-select writes replace, they don't merge — read the current value first).
- **Close**: set `狀態` to `完成` and `完成日期`; use `已封存` for wontfix.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo starts treating external PRs as
feature requests; `/triage` reads this flag.)_

## When a skill says "publish to the issue tracker"

Create a page in the 任務 data source.

## When a skill says "fetch the relevant ticket"

`notion-fetch` the ticket page with `include_discussions: true`.

## Wayfinding operations

Used by `/wayfinder`. The database's own relations carry the structure — don't invent a parallel
convention in page bodies.

- **Map**: one 任務 page holding the Notes / Decisions-so-far / Fog body, tagged `wayfinder:map`
  in `標籤`.
- **Child ticket**: a 任務 page with `Parent-task` set to the map page. Type goes in `標籤` as
  `wayfinder:research` / `wayfinder:prototype` / `wayfinder:grilling` / `wayfinder:task`. Once
  claimed, set `指派人員`.
- **Blocking**: set the child's `被阻擋` relation to its blockers. A ticket is unblocked when every
  page in `被阻擋` has `狀態` of `完成` or `已封存`.
- **Frontier query**: the map's children (`Parent-task` = map) with `狀態` = `未開始`, no
  `指派人員`, and no unfinished page in `被阻擋`. First in database order wins.
- **Claim**: set `指派人員` to the driving dev and `狀態` to `進行中` — the session's first write.
- **Resolve**: comment the answer on the ticket, set `狀態` to `完成`, then append a context pointer
  to the map's Decisions-so-far.

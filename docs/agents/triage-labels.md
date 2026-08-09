# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual
label strings used in this repo's issue tracker.

Labels live in the `標籤` multi-select of the Notion **任務** database (see `issue-tracker.md`).

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label
string from this table.

These five don't exist in `標籤` yet — Notion creates a multi-select option the first time you write
it. They sit alongside the existing topic tags (`行動版`, `網頁版`, `改進`, …), which describe *what
area* a ticket touches, not its triage state. Don't conflate the two sets.

Edit the right-hand column to match whatever vocabulary you actually use.

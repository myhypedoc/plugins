---
name: weekly-update
description: Write a short status update for a manager or team from recent wins in Hype Doc. Use when the user asks for a weekly update, status report, standup summary, or "what did I get done" for a recent period.
---

# Write a status update

Use the Hype Doc MCP tools `list_wins` and `list_spaces`.

## Steps

1. **Pick the period.** Default to the last seven days. Use fourteen if the user says they send updates every two weeks. Compute `since` from today's date.

2. **Fetch the wins** with `list_wins`. Pass `since` and, if the user named a project or space, `space_name`. Use `limit` 100.

3. **Write the update** in this shape:
   - **Highlights:** three to five bullets, biggest first. Outcome first, then the work.
   - **In progress:** one line, only if the user told you what they are on now.
   - **Blockers:** only what the user told you. If you do not know of any, ask whether there is anything to flag.

4. **Keep it short.** It should read in thirty seconds. Group by project only when the wins span more than one. Drop minor wins instead of padding.

5. **Do not invent.** Use only what the wins say. If there are no wins in the period, say so and ask what the user worked on, then offer to log it with the `log-win` skill.

6. Ask if they want it in a different tone or for a different reader.

---
name: log-win
description: Log a win to Hype Doc. Use when the user asks to log, record, or save a win or accomplishment, or says they just shipped, fixed, finished, or learned something worth remembering.
---

# Log a win

Use the Hype Doc MCP tools `log_win`, `list_spaces`, and `list_tags`.

## Steps

1. **Get the win.** If the user already described it, use their words. Write one or two sentences with the outcome first. Do not add numbers, names, or results the user did not give you. If they gave nothing to log, ask what they want to record.

2. **Pick the space.**
   - If the user named a space, pass it as `space_name`.
   - Otherwise call `list_spaces`. If one space clearly fits, use it and say which. If two could fit, ask once.
   - If two spaces share a name, use `space_id` from `list_spaces`.

3. **Set the details only when needed.**
   - Pass `occurred_on` only when the win did not happen today. Use `YYYY-MM-DD`. It cannot be in the future.
   - Pass `tag_names` only when the user asked for tags, or when an existing tag from `list_tags` clearly matches. Do not invent new tags.

4. **Call `log_win`**, then confirm in one line: the space, the date, and the text you saved.

## When something fails

- `You cannot add wins to this space.` The user only has view access to that space. Offer another space.
- `The space owner has reached the free plan limit`. Say so plainly. Do not retry.
- `Insufficient scope`. The connection is read-only. Tell the user to disconnect and reconnect Hype Doc so it can ask for write access.

## Suggesting a win

After you finish significant work with the user, such as merging a PR, fixing a hard bug, or completing a refactor, offer once to log it: "Want me to log that as a win?" Do not log anything the user has not asked for.

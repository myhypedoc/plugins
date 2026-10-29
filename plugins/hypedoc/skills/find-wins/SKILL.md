---
name: find-wins
description: Search and summarize wins logged in Hype Doc. Use when the user asks what they did, shipped, or fixed in a period, on a topic, in a space, or under a tag, or wants to look up a past win.
---

# Find wins

Use the Hype Doc MCP tools `list_wins`, `list_spaces`, and `list_tags`.

## Steps

1. **Map the question to filters.**
   - A topic or keyword goes in `q`. It matches the win text, case-insensitively.
   - A label the user uses for a category goes in `tag`. It must match a tag exactly. Call `list_tags` if you are unsure of the spelling.
   - A project or area goes in `space_name`. Call `list_spaces` if you are unsure.
   - A period goes in `since` and `until` as `YYYY-MM-DD`. Work out phrases like "last quarter" from today's date.

2. **Call `list_wins`.** Results come back newest first. The default `limit` is 20 and the maximum is 100.

3. **Handle `has_more: true`.** There is no cursor. Tell the user that more wins matched, and either narrow the date range yourself and call again, or ask which part they want.

4. **Present the results.** Group by month or by space, whichever fits the question. Show the date, the win text, and tags if there are any. Keep the user's wording. If you summarize, say that you did.

5. **If nothing matches,** try a looser `q` or a wider date range once. Then say plainly that you found nothing, and what you searched for.

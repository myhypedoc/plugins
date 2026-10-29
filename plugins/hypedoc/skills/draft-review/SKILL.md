---
name: draft-review
description: Draft a performance self-review, promotion case, or resume bullets from wins logged in Hype Doc. Use when the user asks for a review, brag document, promotion packet, or resume bullets based on their accomplishments.
---

# Draft a review from logged wins

Use the Hype Doc MCP tools `list_wins`, `list_spaces`, and `list_tags`.

## Steps

1. **Settle the scope.** You need the period and the audience. If the user did not say, ask for both in one question. Offer the last six months as a default. Ask which space to use if they have several.

2. **Fetch the wins.** Call `list_wins` with `since` and `until`, plus `space_name` or `tag` when given, and `limit` set to 100. When the result has `has_more: true`, split the period into smaller date ranges and call again until you have all of it. Say if you could not.

3. **Find the themes.** Group the wins into three to five themes, such as reliability, mentoring, or customer impact. Use tags and spaces as hints, not as the final grouping.

4. **Write the draft.**
   - Lead each point with the outcome, then what the user did.
   - Use only facts that appear in the wins. Keep numbers exactly as written.
   - Use first person for a self-review. Use short bullets for resume output.
   - Keep a bullet to one or two sentences.
   - Order themes by importance to the audience, not by date.

5. **Flag gaps.** After the draft, list wins that state an activity but no result, and ask the user for the missing outcome. Do not guess it.

6. **Offer one next step**, such as a shorter version, a different tone, or resume bullets from the same wins.

## Notes

`export_wins` returns every matching win as one line each, which is useful for a large period when you do not need the structured fields. It needs write access, so prefer `list_wins` when the connection may be read-only.

---
name: weekly-open-loops
description: Build a weekly review of open action items from the last 7 days of recorded meetings. Use for the meeting-follow-through weekly scheduled task or when the user asks what is still open from this week's meetings.
---

# Weekly open loops

## Steps

1. **Collect the week.** Read the last 7 days of daily recaps from the configured destination. If a day's recap is missing, run match-recordings and extract-action-items for that day.
2. **Check what's done.** If the destination tracks completion (checked boxes, completed tasks), drop finished items. If it does not, keep everything and say so at the top.
3. **Group the rest:**
   - **Overdue**: due date has passed
   - **Due next week**
   - **No date**: older than 5 business days gets flagged as likely stale
   - **Waiting on others**: by person, so it doubles as a follow-up list
4. **Draft follow-ups.** For each person owing two or more items, draft a short follow-up message listing them. Draft only; never send.

## Output

One message to the destination:
- Counts at the top (open, overdue, waiting on others)
- The four groups above, each item with its meeting name and date
- The drafted follow-ups, clearly labeled as drafts

Keep it under one screen where possible. If nothing is open, say so in one line.

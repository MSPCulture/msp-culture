---
name: extract-action-items
description: Pull every action item from a Plaud recording with owner, due date, and source timestamp. Use for the meeting-follow-through recipe or when the user asks for to-dos from a recorded meeting.
---

# Extract action items

## Inputs
- One or more Plaud file_ids, each with its matched meeting name
- Owner name for the user (to tell "mine" from "theirs")

## Steps

1. **Start with Plaud's notes.** Call `get_note`. The AI summary usually has an action-items section. Treat it as a starting list, not the answer; it misses items and attributes owners loosely.
2. **Check the highlights.** Call `get_transcript` with `block: mark_memo`. If the user pressed the highlight button, those moments are likely commitments. Map each one to the transcript text around it.
3. **Read the transcript.** Call `get_transcript` (default `transaction` block) and page through with `next_cursor` until done. Look for commitments, not discussion:
   - "I'll / I will / let me / I can get you..."
   - "Can you / could you / we need you to..." followed by agreement
   - deadlines: "by Friday", "before the QBR", "end of month"
4. **Resolve each item:**
   - **Owner:** the speaker who committed. If the speaker label is generic ("Speaker 2"), use attendee names from the calendar event where the transcript makes it clear; otherwise write "Unassigned".
   - **Due date:** convert relative dates to absolute dates in the configured time zone. No date stated means "No date".
   - **Source:** the transcript timestamp, so the user can jump to it.
5. **Deduplicate** items that are restated later in the same meeting. Keep the most specific version.

## Output

Split into two groups:

**Mine**
- [ ] Action, due date, (timestamp)

**Waiting on others**
- [ ] Owner: action, due date, (timestamp)

Lead each meeting with its matched name and Plaud file_id. Never invent an item that is not in the transcript or notes. If nothing qualifies, say "No action items" for that meeting.

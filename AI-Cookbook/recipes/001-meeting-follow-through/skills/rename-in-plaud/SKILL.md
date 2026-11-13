---
name: rename-in-plaud
description: Rename Plaud recordings to their matched meeting names through the Plaud web app (web.plaud.com) in the user's browser. Use for the meeting-follow-through recipe after match-recordings, when browser renaming is turned on.
---

# Rename recordings in Plaud (browser)

The Plaud connector is read-only, so renaming happens in the Plaud web app through a browser tool (Claude in Chrome or the Claude desktop app's built-in browser).

## Inputs
- The match-recordings table (file_id, current name, recording time, new name, confidence)

## Rules
- **Only rename rows marked `matched` or `verified by transcript`.** Never rename `proposed` rows; leave them for the user.
- **Only rename recordings in the table.** Do not rename, move, delete, share, or change anything else in Plaud.
- **Skip recordings already carrying the new name.**
- If the browser isn't available, Plaud asks for a sign-in, or a captcha or MFA prompt appears: stop, and fall back to the rename list. Never enter credentials.

## Steps

1. Load the browser skill for whichever browser is available, then open `https://web.plaud.com` in a new tab.
2. Confirm you're signed in and on the recordings list. If not, stop (see Rules).
3. For each row to rename:
   - Find the recording by its current name **and** its recording date and time. If the two don't agree, or more than one recording matches, skip it and mark it `needs manual rename`.
   - Open the rename control, replace the name with the new name, and save.
   - Re-read the name on the page to verify it saved.
4. Close the tab when done.

## Output

Add a `Renamed` column to the match table with one of:
- `renamed` (verified on the page)
- `already named`
- `skipped: proposed name`
- `needs manual rename: <reason>`

Report counts in one line at the top of the recap ("Renamed 4 of 5; 1 needs manual rename"). If the page layout has changed and you can't find the rename control, say so plainly. That's the sign the recipe needs an update.

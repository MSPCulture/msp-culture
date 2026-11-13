---
name: setup
description: Guided setup for the Meeting Follow-Through recipe. Use when the user runs /setup for this recipe, or asks to install, configure, or reconfigure their meeting follow-through (Plaud meeting recap, action items from recordings).
---

# Meeting Follow-Through: setup

Walk the user through setup in one short conversation, then create the scheduled tasks. Do not make them configure anything by hand.

## 1. Check connectors

Confirm these tools are available in this session. Search for deferred tools before deciding one is missing.

- **Plaud** (list_files, get_note, get_transcript). If missing, tell the user to add Plaud from the connector directory in Settings > Connectors and turn on Plaud Cloud Sync in their Plaud account. Stop until it is connected.
- **A calendar**: Microsoft 365 (Outlook calendar search) or Google Calendar. If neither is present, stop and say which one to connect.
- **A scheduling tool** for scheduled tasks. If none exists, finish setup anyway and tell the user they can run the recap by hand with "run my meeting follow-through".
- **A browser tool** (optional, for renaming): Claude in Chrome or the Claude desktop app's built-in browser. Only needed if the user wants recordings renamed in Plaud.

Run one test call each (list today's Plaud recordings, search today's calendar). If a call fails, report the error plainly.

## 2. Ask five questions

Use a multiple-choice question tool if one is available, otherwise ask in plain text. Ask all five at once.

1. **Time zone.** Default to the user's known time zone; confirm it.
2. **Naming convention** for matched recordings. Offer:
   - `YYYY-MM-DD - Meeting title` (recommended)
   - `Meeting title - YYYY-MM-DD`
   - `Client - Meeting title - YYYY-MM-DD` (client taken from the organizer or attendee domain)
3. **Where action items go.** Offer only destinations a connected tool can write to, plus email-to-self, which always works if a mail tool is connected:
   - Email to self (recommended default)
   - Microsoft To Do / Planner, if connected
   - A running document or tracker the user names
4. **Schedule.** Defaults:
   - Daily recap: weekdays at 5:41 PM local
   - Weekly open-loops review: Fridays at 2:47 PM local
5. **Rename recordings in Plaud?** Only ask if a browser tool exists.
   - Yes, through the browser (recommended if available). Tell the user plainly: the daily run will then need their computer on, the browser open, and Plaud's web app signed in. On days it isn't, they get the rename list instead.
   - No, just give me a rename list

If they choose browser renaming, open https://web.plaud.com once now to confirm they're signed in. If they aren't, ask them to sign in themselves; never enter credentials.

## 3. Create the scheduled tasks

Create two scheduled tasks with the session's scheduling tool. Each run starts fresh with no memory of this conversation, so every prompt must carry the full configuration. Use the templates below and fill in the bracketed values.

**Daily recap prompt**

```
Run the meeting-follow-through daily recap.
Config:
- Time zone: [TZ]
- Naming convention: [CONVENTION]
- Action item destination: [DESTINATION]
- Owner name for "my" action items: [USER NAME]
- Rename in Plaud via browser: [YES/NO]
Steps: use the match-recordings skill for recordings dated today (and yesterday if yesterday's run did not happen). If renaming is YES, run the rename-in-plaud skill on the results; if the browser is unavailable, fall back to a rename list. Then run the extract-action-items skill on each matched recording and deliver to the destination. Skip any Plaud file_id already present in the destination. If there are no recordings, send nothing.
```

If browser renaming is on, create the daily task so it runs with access to the user's computer (the scheduling tool's option for requiring the local device), since the browser lives there. The weekly task doesn't need it.

**Weekly open-loops prompt**

```
Run the meeting-follow-through weekly open-loops review.
Config:
- Time zone: [TZ]
- Action item destination: [DESTINATION]
- Owner name: [USER NAME]
Steps: use the weekly-open-loops skill for the last 7 days and deliver the review to the destination.
```

Use a non-round minute for each schedule (the defaults above already are).

## 4. Confirm

Tell the user, in three lines or fewer:
- what was created and when it runs
- where the output lands
- whether the scheduled runs need approval or run automatically (report what the scheduling tool returned; do not guess)

Then offer to do a test run on today's recordings now.

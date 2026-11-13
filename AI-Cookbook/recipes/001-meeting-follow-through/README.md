# 001 - Meeting Follow-Through

**Every recorded meeting gets matched to your calendar, every action item gets pulled, and anything still open shows up on Friday.**

*For Plaud recordings. An MSP Culture Starter Culture.*

| | |
|---|---|
| **For** | Anyone who records meetings with a Plaud device: service managers, vCIOs, account managers, owners |
| **Setup time** | About 10 minutes |
| **Time saved** | Roughly 15-30 minutes a day if you record 3+ meetings, mostly from not re-listening for to-dos |
| **Runs** | Daily recap on weekdays, open-loops review on Fridays |
| **Version** | 1.0.0 |

## What you get

- **Daily recap.** Each recording matched to its calendar meeting and named consistently, with action items split into "mine" and "waiting on others", each linked to the transcript timestamp.
- **Weekly open loops.** What's overdue, what's due next week, what's gone stale, and drafted follow-ups for anyone who owes you two or more things.
- **Renamed recordings.** If you turn on browser renaming, Claude renames each matched recording in the Plaud web app and verifies it saved. If not, or on days the browser isn't available, you get a rename list instead.

## What you need

- Claude with connectors and scheduled tasks available on your plan
- **Plaud** connector, with Plaud Cloud Sync turned on in your Plaud account
- **A calendar** connector: Microsoft 365 or Google Calendar
- **A place for the output**: email to yourself works for everyone; To Do, Planner, or a tracker if you have that connector
- **Optional, for renaming:** Claude in Chrome or the Claude desktop app's built-in browser, signed in to web.plaud.com, on a computer that's on when the daily recap runs

## Install

1. Add Starter Cultures: `/plugin marketplace add MSPCulture/msp-culture`
2. Install the recipe: `/plugin install meeting-follow-through@msp-culture`
3. Run `/setup` and answer five questions. It checks your connectors, creates both scheduled tasks, and offers a test run.

## How it works

1. **match-recordings** lists the day's Plaud recordings and lines each one up with the calendar event it overlaps most. Close calls (back-to-back meetings) get checked against the transcript.
2. **rename-in-plaud** (optional) opens the Plaud web app in your browser and renames each confidently matched recording. Proposed names are left for you.
3. **extract-action-items** starts from Plaud's summary, then checks your highlight-button moments and reads the full transcript for commitments. Relative dates become real dates.
4. **weekly-open-loops** rolls the week up and drafts follow-ups. It never sends anything.

## Data flow and risk

- **What it changes.** Your calendar is read-only. In Plaud, the only change is recording names, and only if you turn on browser renaming. Nothing is ever deleted, moved, or shared.
- **Browser access.** Renaming acts in your own signed-in browser session. Claude never enters your Plaud password, and stops if a sign-in or MFA prompt appears.
- **Where data goes.** Transcripts pass through Claude and the recap lands only in the destination you choose. Plaud's hosted connector routes through Plaud's servers.
- **Recording consent.** Some states require every party's consent to record a conversation. Know the rules where you and your attendees are before you record. This recipe doesn't change that obligation.
- **Client data.** If you record client meetings, treat the recap destination like any other place client information lives.

## Known limits

- **Renaming goes through the web app.** The Plaud connector can't rename, so renaming drives web.plaud.com. It needs your computer on, and a Plaud website redesign can break it until the recipe is updated. If Plaud adds renaming to its connector, the recipe will switch to that.
- **Speaker names.** If Plaud labels speakers generically, owners on "waiting on others" items may show as Unassigned.
- **Meetings off your calendar** get a proposed name from Plaud's summary, flagged as proposed.
- **Completion tracking** only works if your destination tracks it. Email-only users will see everything as open in the weekly review.

## How you'd know it broke

- No recap on a day you recorded meetings: check that Plaud Cloud Sync uploaded the recordings.
- Every recording shows "proposed": the calendar connector has likely lost its sign-in.
- Recap says "needs manual rename" for everything: Plaud's web app signed you out, or its layout changed.
- The scheduled task ran but stopped: it may be waiting for an approval you didn't see. Check the task's settings.

---

Part of [Starter Cultures](../../README.md). MIT licensed. Powered by [MSP Culture](https://mspculture.com).

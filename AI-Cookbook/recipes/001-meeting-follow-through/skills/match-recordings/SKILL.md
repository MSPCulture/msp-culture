---
name: match-recordings
description: Match Plaud recordings to calendar meetings by time overlap and produce the meeting name for each recording. Use for the meeting-follow-through recipe or when the user asks which meeting a Plaud recording belongs to.
---

# Match recordings to meetings

## Inputs
- A date or date range (default: today, in the configured time zone)
- Naming convention (default: `YYYY-MM-DD - Meeting title`)

## Steps

1. **List recordings.** Call Plaud `list_files` with `date_from` and `date_to`. Do not use the `query` parameter; it only scans recent files. Page until every recording in the range is listed.
2. **Get each recording's window.** Start time and duration come from the list or `get_file`. Compute the end time. Convert everything to the configured time zone.
3. **Pull the calendar** for the same range with whichever calendar connector is available. Ignore all-day events, declined events, and events marked free.
4. **Match by overlap.** For each recording, pick the event with the largest time overlap.
   - Overlap of at least 50% of the recording, or at least 10 minutes: **match**.
   - Two events overlap similarly (back-to-back meetings, a recording that ran long): pick the larger overlap, then confirm by checking the first two pages of the transcript for the attendees' names or the meeting topic. Mark it **matched, verified by transcript**.
   - No event overlaps: **unmatched**. Propose a name from Plaud's AI summary topic in the same convention, and flag it as proposed.
5. **Build the name** with the naming convention. Strip characters that are illegal in filenames (`\ / : * ? " < > |`).

## Output

A table, one row per recording:

| Plaud file_id | Current name | Recording time | Matched meeting | New name | Confidence |

Confidence is one of: `matched`, `verified by transcript`, `proposed (no calendar match)`.

## Renaming

The Plaud connector is read-only, so this skill never renames anything itself. If browser renaming is turned on in the config, hand the table to the rename-in-plaud skill. Otherwise, include the table in the recap as a rename list. Never claim a recording was renamed unless rename-in-plaud verified it.

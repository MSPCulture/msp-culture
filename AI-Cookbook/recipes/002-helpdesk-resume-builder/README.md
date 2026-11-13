# 002 - Helpdesk Resume Builder

**A resume tailored to the job you're actually applying for, built from everything you've really done, and checked the way an ATS and a hiring manager would read it.**

*For MSP and IT technicians, Tier 1 through Tier 3. An MSP Culture Starter Culture.*

| | |
|---|---|
| **For** | Helpdesk techs, helpdesk admins, sysadmins, and systems or network engineers looking for their next role. Also worth handing to anyone you're laying off |
| **Setup time** | About 5 minutes to install. Plan on an hour for the first session, most of it spent on the experience interview |
| **Time saved** | Each tailored resume after the first takes minutes instead of an evening, because the experience database is already done |
| **Runs** | On demand |
| **Version** | 1.1.0 |

Most helpdesk resumes I see aren't bad because the person lacks experience. They're bad because the experience never makes it onto the page. "Developed PowerShell scripts to improve efficiency" could mean anything. This recipe's job is to drag the real version out of you, then put it where a recruiter will actually see it.

It's built around MSP titles because that's where most of these jobs are, and because a "Systems Administrator" at one MSP is a "Helpdesk Tech II" at the next. It figures out the real tier from the work, not the title, and writes to the tier of the job you're applying for.

It isn't built for lead, manager, architect, vCIO, or director roles. Those resumes sell leadership and strategy, and that's a different exercise.

## What you get

- **An experience database.** Built from your LinkedIn export and old resumes, then an interview role by role for the stuff that never gets written down: ticket volume, client counts, the tools you actually used, the scripts you wrote and what they saved. You keep `experience-database.md` and bring it back for every application.
- **A read on the job posting.** Must-haves vs nice-to-haves, the real tier behind the title, red flags, and an honest take on how well you match.
- **A tailored resume.** It asks about anything the posting wants that your database doesn't cover, then builds a single-column .docx for that role.
- **An ATS and grammar check.** It extracts the text the way an ATS would and reads what comes out, so a header in a text box or a three-column skills grid gets caught instead of guessed at. It also checks tense, duplicate bullets, honest cert status, years of experience that don't match your dates, and misspelled vendor names (it's ConnectWise, not Connect Wise).
- **Interview prep, if you want it.** Every bullet on your resume is a question you'll get asked. It walks you through the story behind each one, has you explain why the fundamentals work, runs troubleshooting scenarios for Tier 2 and 3, and helps you build questions to ask them.

## What it won't do

- Make things up. No invented metrics, tools, titles, or certs. If a number would help and you don't have one, it'll ask for an honest estimate or leave it out.
- Promote you. Your real title stays your real title.
- Pass off an expired cert as active.

## What you need

- A paid Claude plan (Pro, Max, Team, or Enterprise) with code execution turned on
- Your LinkedIn export. The full data export (Settings > Data privacy > Get a copy of your data) is better than the profile PDF
- Any old resumes, even rough ones
- The job posting you're applying to

No connectors and no `/setup`. There's nothing to schedule, so you just start a chat.

## Install

You don't need to know git for this. You just need the zip file.

### Claude app (web or desktop)

1. **[Download helpdesk-resume-builder.zip](https://github.com/MSPCulture/msp-culture/raw/main/AI-Cookbook/recipes/002-helpdesk-resume-builder/helpdesk-resume-builder.zip).** Don't unzip it. Claude wants the zip as-is.
2. Open Claude on the web or desktop app and go to **Settings**, then find the **Skills** section. If you can't find it, [Anthropic's help article](https://support.claude.com/en/articles/12512180-using-skills-in-claude) has the current location.
3. Click **Upload skill** (it may be a **+** button) and pick the zip you downloaded.
4. Make sure the skill is turned on. Skills also need code execution turned on in the same settings area.
5. Start a new chat and say something like "help me build a resume for a helpdesk job" or "review my resume for this posting."

### Claude Code

Install it as a plugin:

1. `/plugin marketplace add MSPCulture/msp-culture`
2. `/plugin install helpdesk-resume-builder@msp-culture`

Or download the same zip and unzip it into `~/.claude/skills/`, so you end up with `~/.claude/skills/helpdesk-resume-builder/SKILL.md`.

### Updating to a new version

Download the zip again from the link above (it always has the newest version), delete the old skill in Claude's settings, and upload the new one. Bring your `experience-database.md` with you; it works across versions.

## How it works

One skill, four stages, in order:

1. **Experience database:** load an existing one or build it from your LinkedIn export, old resumes, and an interview weighted to your tier
2. **Job description:** place the posting by tier, split must-haves from nice-to-haves, and map it against your database
3. **Gap interview and resume:** ask about what's missing, then write a single-column .docx for that posting
4. **ATS and grammar review:** extract the text, check layout, consistency, spelling, and vendor names, and report fixes by impact

Interview prep is an optional fifth step it offers once the resume is done.

## Data flow and risk

- **What it reads.** Only what you give it: your LinkedIn export, resumes, and the job posting. It can fetch a job posting URL if you give one.
- **What it writes.** Files in your chat: `experience-database.md` and the resume .docx. Nothing gets sent, posted, or submitted anywhere.
- **Personal information.** Your resume and work history pass through Claude like anything else you upload. Leave out anything you wouldn't put on a resume, such as references' phone numbers or salary history, unless you want it considered.

## Known limits

- It can't log into LinkedIn or pull your profile directly. You'll need to export it.
- Some job boards block automated fetching. If a URL doesn't load, paste the posting text instead.
- The vendor spelling list is weighted toward the MSP stack. Open an issue if it's missing something you see on resumes all the time.
- It's tuned for Tier 1 through Tier 3. Senior and leadership resumes need a different approach.

## How you'd know it broke

- Claude writes a generic resume without asking you anything: the skill probably isn't turned on. Check Settings, or ask it to "use the helpdesk resume builder skill."
- No .docx comes back: code execution is likely off in your settings.
- Upload fails with a structure error: you uploaded an unzipped folder or re-zipped it. Use the zip as downloaded.

## Further reading

A lot of what this recipe checks for comes from a series I wrote back in 2017 about getting hired at an MSP. The tools have changed names since then. The advice mostly hasn't.

- [Working at an MSP - Part 1 - Resumes](https://www.linkedin.com/pulse/getting-job-part-1-resumes-jordan-silva/)
- [Working at an MSP - Part 2 - The Interview](https://www.linkedin.com/pulse/working-msp-part-2-interview-jordan-silva/)
- [Working at an MSP - Part 3 - You Got the Job. Now What?](https://www.linkedin.com/pulse/working-msp-part-3-you-got-job-now-what-jordan-silva/)

## For maintainers

The zip is built from `skills/helpdesk-resume-builder/SKILL.md` and has to be rebuilt whenever that file changes. It must contain the folder, not just the file:

```
helpdesk-resume-builder.zip
└── helpdesk-resume-builder/
    └── SKILL.md
```

---

Part of [Starter Cultures](../../README.md). MIT licensed. Powered by [MSP Culture](https://mspculture.com).

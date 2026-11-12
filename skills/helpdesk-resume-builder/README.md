# Helpdesk Resume Builder

A Claude skill for people going after helpdesk, service desk, and Tier 1-2 IT support roles. It builds a master record of everything you've done, tailors a resume to one specific job posting at a time, and then checks the result the way an ATS and a hiring manager would.

Most helpdesk resumes I see aren't bad because the person lacks experience. They're bad because the experience never makes it onto the page. "Developed PowerShell scripts to improve efficiency" could mean anything. The skill's job is to drag the real version out of you, then put it where a recruiter will actually see it.

## What it does

1. **Builds an experience database.** Starts from your LinkedIn export and old resumes, then interviews you role by role for the stuff that never gets written down: ticket volume, client counts, the tools you actually used, the scripts you wrote and what they saved. You keep the resulting `experience-database.md` and bring it back for every application.
2. **Reads the job description.** Paste it, upload it, or give it a URL. It sorts must-haves from nice-to-haves, figures out the real level behind the title, flags red flags, and tells you honestly how well you match.
3. **Asks about the gaps, then writes the resume.** If the posting wants Intune and your database doesn't mention it, you'll get asked. Then it builds a single-column .docx tailored to that role.
4. **Runs an ATS and grammar check.** It extracts the text the way an ATS would and reads what comes out, so a header in a text box or a three-column skills grid gets caught instead of guessed at. It also checks tense, duplicate bullets, honest cert status, years of experience that don't match your dates, and misspelled vendor names (it's ConnectWise, not Connect Wise).
5. **Preps you for the interview, if you want it.** Every bullet on your resume is a question you'll get asked. It walks you through the story behind each one, has you explain why the fundamentals work instead of what the acronyms stand for, and helps you build questions to ask them.

## What it won't do

- Make things up. No invented metrics, tools, titles, or certs. If a number would help and you don't have one, it'll ask for an honest estimate or leave it out.
- Promote you. Your real title stays your real title.
- Pass off an expired cert as active.

## Install

**Claude (web, desktop, mobile):** download this folder, zip it so `SKILL.md` sits at the top level of the zip, and upload it as a custom skill in Claude's settings.

**Claude Code:** copy the folder into `~/.claude/skills/` so you end up with `~/.claude/skills/helpdesk-resume-builder/SKILL.md`.

## Use it

Start a chat and say something like "help me build a resume for a helpdesk job" or "review my resume for this posting." Have these handy:

- Your LinkedIn export. The full data export (Settings > Data privacy > Get a copy of your data) is better than the profile PDF.
- Any old resumes, even rough ones
- The job posting you're applying to

Give the first session some time. The database interview is the part that makes everything after it better. Once you have the database, tailoring for each new posting goes a lot faster.

## Known limits

- It can't log into LinkedIn or pull your profile directly. You'll need to export it.
- Some job boards block automated fetching. If a URL doesn't load, paste the posting text instead.
- The vendor spelling list is weighted toward the MSP stack. Open an issue if it's missing something you see on resumes all the time.

## Further reading

A lot of what this skill checks for comes from a series I wrote back in 2017 about getting hired at an MSP. The tools have changed names since then. The advice mostly hasn't.

- [Working at an MSP - Part 1 - Resumes](https://www.linkedin.com/pulse/getting-job-part-1-resumes-jordan-silva/)
- [Working at an MSP - Part 2 - The Interview](https://www.linkedin.com/pulse/working-msp-part-2-interview-jordan-silva/)
- [Working at an MSP - Part 3 - You Got the Job. Now What?](https://www.linkedin.com/pulse/working-msp-part-3-you-got-job-now-what-jordan-silva/)

## Changelog

- **v1.0 (November 2026):** First public release.

## License

MIT © MSP Culture

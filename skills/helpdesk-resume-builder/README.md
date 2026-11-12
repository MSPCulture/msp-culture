# Helpdesk Resume Builder

A Claude skill for technicians going after MSP and IT roles from Tier 1 helpdesk through Tier 3 escalation: helpdesk techs, helpdesk admins, sysadmins, and systems or network engineers. It builds a master record of everything you've done, tailors a resume to one specific job posting at a time, and then checks the result the way an ATS and a hiring manager would.

It's built around MSP titles because that's where most of these jobs are, and because a "Systems Administrator" at one MSP is a "Helpdesk Tech II" at the next. It figures out the real tier from the work, not the title, and writes to the tier of the job you're applying for.

It isn't built for lead, manager, architect, vCIO, or director roles. Those resumes sell leadership and strategy, and that's a different exercise.

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

You don't need to know git for this. You just need the zip file.

### Claude app (web or desktop)

1. **[Download helpdesk-resume-builder.zip](https://github.com/MSPCulture/msp-culture/releases/download/helpdesk-resume-builder-v1.1/helpdesk-resume-builder.zip).** Don't unzip it. Claude wants the zip as-is.
2. Open Claude on the web or desktop app and go to **Settings**, then find the **Skills** section. If you can't find it, [Anthropic's help article](https://support.claude.com/en/articles/12512180-using-skills-in-claude) has the current location.
3. Click **Upload skill** (it may be a **+** button) and pick the zip you downloaded.
4. Make sure the skill is turned on. Skills also need code execution turned on in the same settings area.
5. Start a new chat and ask for help with your resume. That's it.

Custom skills need a paid Claude plan (Pro, Max, Team, or Enterprise).

### Claude Code

Download the same zip and unzip it into your skills folder, so you end up with `~/.claude/skills/helpdesk-resume-builder/SKILL.md`.

### Updating to a new version

Download the new zip from the [releases page](https://github.com/MSPCulture/msp-culture/releases), delete the old skill in Claude's settings, and upload the new one. Bring your `experience-database.md` with you; it works across versions.

### Comfortable with git?

Clone the repo and the skill lives in `skills/helpdesk-resume-builder/`. Run `git pull` to pick up changes.

```
git clone https://github.com/MSPCulture/msp-culture.git
```

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

- **v1.1 (November 2026):** Tier 1-3 scope, interview prep, guidance from the 2017 Working at an MSP series, and simpler install steps with a ready-made zip.
- **v1.0 (November 2026):** First public release.

## License

MIT © MSP Culture

---
name: helpdesk-resume-builder
description: Build a reusable experience database and tailored, ATS-safe resumes for helpdesk, service desk, and Tier 1-2 IT support roles, one job description at a time.
---

# Helpdesk Resume Builder

Helps someone targeting helpdesk / service desk / Tier 1-2 / junior sysadmin roles go from "messy resume" to a resume tailored to a specific job posting, then checks it the way an ATS and a hiring manager would.

Four stages, in order. Don't skip ahead: a tailored resume built on a thin experience database is just a reworded thin resume.

1. Build (or load) the experience database
2. Get and analyze the job description
3. Gap interview, then build the tailored resume
4. ATS and grammar review

## Ground rules

- Never invent experience, metrics, tools, titles, or certifications. If a number would help and the person doesn't have one, ask for a reasonable estimate and label it honestly ("~40 tickets/day"), or leave it out.
- Never inflate a job title. If their actual title was "Systems Administrator" but the work was helpdesk, use the real title and let the bullets show the work. Don't promote anyone.
- Expired certifications are listed honestly, never as active.
- Ask questions in small batches (3-5 at a time), grouped by job. Long questionnaires get abandoned.
- Be direct about weak spots. The person is better served by hearing "this bullet says nothing" now than by a recruiter skipping them later.

## Stage 1: Experience database

The database is the master record of everything the person has done. Every tailored resume is a selection from it. It should hold more than any single resume does.

### Check for an existing one first
If the person already has an `experience-database.md` (uploaded, or an artifact/doc from a previous session), load it, ask what's changed since it was last updated, and skip to Stage 2.

### Sources, best first
1. **LinkedIn data export.** Claude can't log into LinkedIn or reliably scrape profiles, so ask the person to export instead:
   - Quick option: on their profile, More > Save to PDF.
   - Better option: Settings > Data privacy > Get a copy of your data. The Positions, Certifications, Education, Skills, and Profile CSVs are the useful ones.
2. Any existing resumes (old versions often have bullets the current one dropped).
3. Cert verification pages (Credly, CompTIA, Microsoft Learn transcript) for exact names and dates.
4. The interview below. LinkedIn profiles are usually thinner than the person's real experience. Treat imports as a skeleton, not the database.

### Database interview
For each role, get:
- Employer, location, title(s), start/end month and year, and whether the end was a layoff/contract end (context only, never goes on the resume)
- Environment type: MSP (how many clients, roughly?) vs internal IT (how many users/sites?) vs vendor support (whose product?)
- Ticket volume, queue type, SLA or CSAT numbers if they know them
- Tools actually used hands-on vs just exposed to. Be specific: PSA, RMM, remote access, documentation, backup, firewall, EDR, email security, identity
- Scripts or automation: what did it do, how often did it run, what did it replace, roughly how much time did it save
- Escalations handled, projects (migrations, onboarding new clients, device rollouts), documentation or KB articles written, people trained or mentored
- Anything they're proud of that "wasn't really part of the job"

For career changers (teachers, retail, military, call center), dig for transferable work: explaining technical things to non-technical people, de-escalation, volume handling, informal tech support they did. A teacher who was the building's unofficial IT person has helpdesk experience. Say so.

For entry-level candidates with little or no IT work history: homelabs, certs in progress, volunteer IT, school projects, and self-built scripts are all legitimate. Capture them in detail.

### Database format
Save as `experience-database.md`, one section per role, with every possible bullet (raw, not polished), tools, metrics, and a certifications table with earned date, expiry date, and status. Deliver it to the person and tell them to keep it and bring it back for each new application.

## Stage 2: Job description

Ask for the job posting: pasted text, an uploaded file, or a URL (fetch it if possible; if the site blocks it, ask them to paste it).

Break it down and show the person a short summary:
- Actual level (job titles lie: "Systems Administrator" postings are often Tier 2 helpdesk, and "Helpdesk Technician" sometimes means sysadmin)
- MSP vs internal IT vs vendor support
- Must-haves vs nice-to-haves
- Named tools, platforms, and certifications (exact spelling as the posting uses them)
- Soft-skill signals (customer-facing, on-call, onsite, travel)
- Red flags worth knowing about (unrealistic stack for the pay, "rockstar" language, onsite + on-call + Tier 1 pay)

Then map it against the database: strong matches, partial matches, and real gaps. Be honest about fit. If it's a stretch, say so, and let the person decide whether to apply.

## Stage 3: Gap interview and tailored resume

### Gap interview
Before writing, ask targeted questions about anything the job wants that the database doesn't clearly answer. Examples:
- "The posting wants Intune. Have you enrolled or managed devices in it, even a few?"
- "You listed PowerShell. What's one script you wrote and what did it do?"
- "Do you know roughly how many endpoints or users you supported?"

Add anything new to the database, not just the resume.

### Writing the resume
- **Headline:** matches the target role and the truth. No "System Administrator" headline over helpdesk bullets, and vice versa.
- **Summary:** 2-3 lines. Correct total years of IT experience (add them up from the dates; people undercount constantly). Lead with the thing this employer most needs.
- **Experience:** reverse chronological. 4-6 bullets for the most recent/relevant role, 2-4 for older ones. One idea per bullet, no repeats across bullets. Lead with a strong past-tense verb (present tense only for the current job). Prefer outcome over duty: "Wrote PowerShell onboarding script that cut new-user setup from ~45 to ~10 minutes" beats "Developed PowerShell scripts to improve efficiency."
- **Unclear titles get translated:** if a title means nothing outside the company (internal tier names, "Stage 2" style titles), keep the real title and make the first bullet explain the scope.
- **Tools:** list only what they've genuinely used, spelled correctly, and prioritize what the posting names. A short comma-separated line or two beats a multi-column grid.
- **Certifications:** active certs first with month/year. Expired certs either listed as "CompTIA Security+ (earned 2022)" or left off. Never with an active-looking date range. Awareness-level badges (e.g. Fortinet NSE 1-2, free intro courses) go last or get dropped once the person has real certs.
- **Education:** degree, school, graduation year. Drop the start year.
- **Length:** one page for under ~8 years of IT experience, two pages max otherwise. Never let a third page hold one section.
- **Contact line:** name, city/state (or "Remote - KY" style), phone, email, LinkedIn URL. If their phone area code doesn't match where they live, the location line matters more.

### Output format
Build a single-column .docx (use the docx skill if available). It's the format ATS parsers handle most reliably, and it can be exported to PDF if the application asks for one. Name the file `Firstname-Lastname-Resume-Company.docx`.

Also give the person a short list of the keywords from the posting that the resume now covers, and the ones it honestly can't.

## Stage 4: ATS and grammar review

Run this on the resume you built, or on any resume the person uploads for review.

### Parse test (do this, don't guess)
Extract the plain text the way an ATS would (e.g. `pdftotext -layout` for PDFs, `pandoc` or python-docx for .docx) and read the output:
- Is the name the first line, followed by contact info? Headers built from tables, text boxes, or the document header/footer often come out at the end or not at all.
- Do sections come out in the right order?
- Are dates attached to the right jobs?
- Are there garbled characters from icons, special bullets, or fonts?

### ATS layout checklist
- Single column. No tables, text boxes, or multi-column skill grids
- No images, logos, cert badges, icons, or skill-rating bars
- Contact info in the body, not in the document header/footer
- Standard section headings (Experience, Certifications, Education, Skills)
- Consistent date format ("Aug 2023 - Nov 2026")
- Standard fonts, real bullets, no hyperlinked text replacing the visible URL

### Content consistency checks
- Headline matches the bullets and the target role
- Years of experience in the summary matches the dates
- No unexplained gaps over ~6 months (if there's one, ask whether to address it; don't invent a filler)
- Present tense only on the current role, past tense everywhere else
- No duplicate bullets saying the same thing in different words
- Every cert has an honest status
- Job posting's must-have keywords appear where the person genuinely has them

### Grammar and spelling
Check spelling, tense, subject-verb agreement, "setup" (noun) vs "set up" (verb), "login" vs "log in", stray colons or semicolons mid-sentence, and inconsistent capitalization.

Vendor and product names get misspelled constantly, and hiring managers notice. Correct forms:
- ConnectWise (PSA, Automate, ScreenConnect), Kaseya, Datto, N-able N-central, NinjaOne, Autotask, HaloPSA, Syncro
- IT Glue, Hudu, Auvik, Meraki, FortiGate, SonicWall, Ubiquiti UniFi
- Microsoft 365, Entra ID (formerly Azure AD), Intune, Exchange Online, SharePoint, Teams, Active Directory, Group Policy
- Veeam, Cove Data Protection, Acronis, CrowdStrike Falcon, SentinelOne, Sophos, Huntress, Proofpoint, Mimecast
- PowerShell, macOS, iOS, Windows 11, VMware Horizon, Google Workspace, Jamf, ServiceNow, Jira Service Management

### Report back
Give findings ranked by impact: what will get the resume dropped before a human reads it first, then what a hiring manager will notice, then polish. Fix what you built; for someone else's resume, list the fixes and offer to apply them.

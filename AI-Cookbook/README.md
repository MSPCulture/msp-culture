# Starter Cultures

**Installable AI workflows for MSPs and IT operators, from MSP Culture.**

A starter culture is a small amount of something living that you add to your own environment and grow. Each one here solves one real operational problem, installs in about ten minutes, and gets tuned to your shop from there.

Most AI tips get shared as a prompt in a post. You save it, tweak it, lose it, and never set up the schedule that made it useful. These recipes ship as Claude plugins: the prompts, the connector checks, and a guided `/setup` that creates the scheduled tasks for you.

## Recipes

| # | Recipe | What you get | Needs |
|---|---|---|---|
| 001 | [Meeting Follow-Through](recipes/001-meeting-follow-through/) | Recordings matched to meetings, action items pulled, weekly open loops | Plaud, M365 or Google Calendar |
| 002 | [Helpdesk Resume Builder](recipes/002-helpdesk-resume-builder/) | A resume tailored to each job posting, an ATS and grammar check, and optional interview prep, for Tier 1-3 techs | Nothing beyond Claude; also installs as a plain skill zip |

New recipes land about every two weeks. Watch the [msp-culture repo](https://github.com/MSPCulture/msp-culture) to get them.

## Install

```
/plugin marketplace add MSPCulture/msp-culture
/plugin install <recipe-name>@msp-culture
```

Then run `/setup` if the recipe has one. Recipes that need no connectors or schedules, like the resume builder, skip it.

Not on a plugin-capable setup? Every recipe's `skills/` folder is plain Markdown. Read it, copy the logic, and adapt it to whatever you use.

## How every recipe is built

- **One job per skill**, so you can also run each step by hand
- **A guided `/setup`** whenever a recipe needs connectors or scheduled tasks
- **A recipe card** with honest setup time, data flow, known limits, and how you'd know it broke
- **Read-first by default.** Anything that sends, changes, or deletes is called out on the card

## Contributing

Found a bug or a better approach? Open an issue. Have a workflow you think belongs here? Open an issue with the problem it solves and what it needs. Start from `templates/` if you're submitting one.

## Want it set up for your shop?

The recipes are free. If you want them tuned to your PSA, RMM, and naming conventions, and your team trained on them, that's what [MSP Culture](https://mspculture.com) does.

## License

MIT. Use it, change it, ship it to your clients.

---

Powered by [MSP Culture](https://mspculture.com).

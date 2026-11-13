---
name: setup
description: Guided setup for the RECIPE NAME recipe. Use when the user runs /setup for this recipe, or asks to install or reconfigure it.
---

# RECIPE NAME: setup

1. **Check connectors.** List each required connector, run one harmless test call against it, and stop with a plain fix if any is missing.
2. **Ask the questions.** Keep it to four or fewer, each with a recommended default. Only offer options a connected tool can actually do.
3. **Create scheduled tasks.** Each run starts fresh, so every prompt carries the full configuration. Use non-round minutes.
4. **Confirm** in three lines: what was created, where output lands, and whether runs need approval (from the tool's result, not a guess). Offer a test run.

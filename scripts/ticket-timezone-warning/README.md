# MSP_Culture-TicketTimezoneWarning

A userscript for ConnectWise PSA that shows a badge on a ticket when the contact is outside business hours or it's a holiday in their timezone. The point is to keep a tech from calling someone at 6:45am, or on the day after Thanksgiving, in the contact's local time.

**Install:** [MSP_Culture-TicketTimezoneWarning.user.js](https://raw.githubusercontent.com/MSPCulture/msp-culture/main/scripts/ticket-timezone-warning/MSP_Culture-TicketTimezoneWarning.user.js) (with Tampermonkey installed, this link opens the install prompt)

- No API keys and no setup. It reads the ticket's State and Zip from the page.
- Nothing leaves the browser. The script makes no network calls and runs with `@grant none`, so it gets no extension privileges beyond the page itself.
- Timezone lookup runs in this order: per-client `OVERRIDES`, then split-state zip3 rules, then the state default.
- Holidays come from date rules, so there's no list to update each January. Observed-day shifts are handled.
- Badge colors: **red** means outside hours, **amber** means inside hours but it's a holiday, and nothing shows on a normal open day.

## Install
1. Install [Tampermonkey](https://www.tampermonkey.net/) or Violentmonkey.
2. **Chrome and Edge only:** open `chrome://extensions` (or `edge://extensions`), click **Details** on Tampermonkey, and turn on **Allow User Scripts**. Without it the script installs and shows as enabled but never runs. On older browser versions, turn on **Developer mode** at the top right of that page instead.
3. Click the install link above. The extension will show the script and an **Install** button.
4. Open a ticket in ConnectWise PSA. If the contact is outside business hours, the badge appears in the top-right corner.

**On-prem ConnectWise:** the script only runs on `*.myconnectwise.net` and `*.connectwisedev.com`. For your own server, open the script in Tampermonkey, go to its **Settings** tab, and add your hostname (for example `https://cw.example.com/*`) under **User matches**. That setting survives updates; editing the `@match` line in the code does not.

## Configure (top of the script)
| Setting | What it does |
|---|---|
| `CONFIG.businessStartHour` / `businessEndHour` / `businessDays` | Defines business hours in the contact's local time |
| `CONFIG.warnOnlyWhenClosed` | `true` shows the badge only when it's not OK to call; `false` always shows it |
| `CONFIG.position` | Badge corner: `top-right`, `top-left`, `bottom-right` or `bottom-left` |
| `CONFIG.holidayMessage` | The text in the holiday banner |
| `CONFIG.debug` | Logs what the script found to the browser console |
| `HOLIDAY_RULES` | Turns holidays on or off. Defaults are the days most private employers close |
| `CUSTOM_HOLIDAYS` | One-off dates, such as a client closure |
| `OVERRIDES` | Pins a zip or company to a timezone. Use this for clients near a timezone line |

## Updates
The script checks this repo for new versions. If you change its settings in the code (holidays, overrides, business hours), an update will replace your changes. Once you've customized your copy, turn off **Check for updates** on the script's Settings tab in Tampermonkey, and watch this repo for releases instead.

## Known limits
- It uses the ticket's **site** address, not the contact's personal location, so remote workers may get the wrong timezone.
- Zip3 rules are approximate near timezone lines. The script lists the known-mixed areas; pin those clients in `OVERRIDES`.
- If the Tampermonkey menu on a ticket says it has no access to the page, or the browser's extension menu says "No access needed," the browser isn't letting it run. Check the **Allow User Scripts** toggle from the install steps first. On a managed browser, a policy such as `runtime_blocked_hosts` can also block extensions from the PSA; that's your security team's call, and they can allow `*://*.myconnectwise.net` for Tampermonkey only.
- The DOM label matching hasn't been tested on every CW screen. Set `debug: true` and check the console if the badge doesn't appear, and [open an issue](https://github.com/MSPCulture/msp-culture/issues) with the screen it failed on.

## Changelog
- **1.3.1** First public release. Fixed a label-matching bug where a wrapper element holding both a label and its field could make the script read the next field's value (for example, the zip as the state). Added update and support links.

## License
MIT © MSP Culture

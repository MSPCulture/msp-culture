// ==UserScript==
// @name         MSP_Culture-TicketTimezoneWarning
// @namespace    msp-culture
// @version      1.3.1
// @description  Shows a badge on ConnectWise PSA (Manage) tickets with the contact's local time and whether they're inside/outside business hours (8am-5pm Mon-Fri, contact-local). Timezone is derived from the ticket address (zip first, state fallback), with per-client overrides.
// @author       MSP Culture
// @license      MIT
// @homepageURL  https://github.com/MSPCulture/msp-culture/tree/main/scripts/ticket-timezone-warning
// @supportURL   https://github.com/MSPCulture/msp-culture/issues
// @updateURL    https://raw.githubusercontent.com/MSPCulture/msp-culture/main/scripts/ticket-timezone-warning/MSP_Culture-TicketTimezoneWarning.user.js
// @downloadURL  https://raw.githubusercontent.com/MSPCulture/msp-culture/main/scripts/ticket-timezone-warning/MSP_Culture-TicketTimezoneWarning.user.js
// @match        https://*.myconnectwise.net/*
// @match        https://*.connectwisedev.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/*
 * MSP_Culture-TicketTimezoneWarning — contact timezone badge for ConnectWise PSA
 * Author: MSP Culture — Company Culture x Technical Operations
 *
 * Why: techs work a queue in their own timezone; contacts don't live there.
 * This puts the contact's local time in front of the tech before they pick
 * up the phone, so nobody cold-calls a user at 6:45am or 7pm their time.
 *
 * Install: Tampermonkey / Violentmonkey / Greasemonkey. On-prem ConnectWise
 * servers: add your own match line for your server's hostname in the header
 * above (e.g. https://cw.example.com/*).
 *
 * Holidays: rule-based (see HOLIDAY_RULES), evaluated on the contact's
 * local date. On a holiday the badge always shows, amber if inside hours.
 *
 * Accuracy model: OVERRIDES (exact) -> split-state zip3 rules (approximate)
 * -> state default. Pin every client that sits near a timezone line in
 * OVERRIDES; the zip3 rules are a safety net, not a source of truth.
 *
 * ---------------------------------------------------------------------------
 * MIT License — Copyright (c) 2026 MSP Culture
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
  'use strict';

  /* =========================================================================
   * CONFIG  — tweak these
   * ========================================================================= */
  const CONFIG = {
    // Business-hours window, evaluated in the CONTACT's local time.
    businessStartHour: 8,   // 8am
    businessEndHour: 17,    // 5pm (24h)
    businessDays: [1, 2, 3, 4, 5], // 0=Sun ... 6=Sat  -> Mon-Fri

    // true  = quiet when it's fine to call, warn only when it isn't (default).
    // false = always show the badge (green when open, red when closed).
    warnOnlyWhenClosed: true,

    // Re-check / redraw interval (ms). Keeps the clock fresh.
    refreshMs: 60 * 1000,

    // Flip to true to get console logging while you tune the DOM selectors.
    debug: false,

    // Badge position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    position: 'top-right',

    // Holiday banner. Evaluated on the CONTACT's local date. On a holiday the
    // badge shows even during business hours (amber) so the tech knows the
    // user may be out or on reduced hours.
    holidayBanner: true,
    holidayMessage: 'Today is a holiday and may impact users\' available hours.',
  };

  /* =========================================================================
   * HOLIDAYS — rule-based, so there's no list to update every January.
   * Toggle `on` to match what your clients actually observe. Defaults are the
   * days most private employers close; the rest are off but ready to enable.
   *   fixed:   [month, day]            observe: shift Sat->Fri, Sun->Mon
   *   nth:     [month, weekday, n]     n = 1..4, or -1 for "last"
   *   offset:  days relative to another rule's date (by id)
   * ========================================================================= */
  const HOLIDAY_RULES = [
    { id: 'newyear',      on: true,  name: "New Year's Day",       fixed: [1, 1],   observe: true },
    { id: 'mlk',          on: false, name: 'Martin Luther King Jr. Day', nth: [1, 1, 3] },
    { id: 'presidents',   on: false, name: "Presidents' Day",      nth: [2, 1, 3] },
    { id: 'goodfriday',   on: false, name: 'Good Friday',          easter: -2 },
    { id: 'memorial',     on: true,  name: 'Memorial Day',         nth: [5, 1, -1] },
    { id: 'juneteenth',   on: false, name: 'Juneteenth',           fixed: [6, 19],  observe: true },
    { id: 'independence', on: true,  name: 'Independence Day',     fixed: [7, 4],   observe: true },
    { id: 'labor',        on: true,  name: 'Labor Day',            nth: [9, 1, 1] },
    { id: 'columbus',     on: false, name: 'Columbus / Indigenous Peoples\' Day', nth: [10, 1, 2] },
    { id: 'veterans',     on: false, name: 'Veterans Day',         fixed: [11, 11], observe: true },
    { id: 'thanksgiving', on: true,  name: 'Thanksgiving',         nth: [11, 4, 4] },
    { id: 'blackfriday',  on: true,  name: 'Day after Thanksgiving', offset: ['thanksgiving', 1] },
    { id: 'xmaseve',      on: true,  name: 'Christmas Eve',        fixed: [12, 24] },
    { id: 'christmas',    on: true,  name: 'Christmas Day',        fixed: [12, 25], observe: true },
    { id: 'nye',          on: false, name: "New Year's Eve",       fixed: [12, 31] },
  ];

  // One-off dates (contact-local), e.g. a regional closure or a snow day.
  const CUSTOM_HOLIDAYS = {
    // '2026-12-26': 'Extended holiday closure',
  };

  /* =========================================================================
   * PER-CLIENT OVERRIDES  — the "always correct" layer.
   * Key by 5-digit zip OR by (lowercased) company name. Value = IANA tz.
   * Overrides win over every heuristic below.
   * Examples:
   *   '42101': 'America/Chicago',          // Bowling Green, KY -> Central
   *   'acme co': 'America/Denver',
   * ========================================================================= */
  const OVERRIDES = {
  };

  /* =========================================================================
   * STATE -> TIMEZONE base map.
   * Split states get their majority zone here and are refined by zip below.
   * ========================================================================= */
  const STATE_TZ = {
    // Eastern
    CT:'America/New_York', DE:'America/New_York', DC:'America/New_York', GA:'America/New_York',
    ME:'America/New_York', MD:'America/New_York', MA:'America/New_York', NH:'America/New_York',
    NJ:'America/New_York', NY:'America/New_York', NC:'America/New_York', OH:'America/New_York',
    PA:'America/New_York', RI:'America/New_York', SC:'America/New_York', VT:'America/New_York',
    VA:'America/New_York', WV:'America/New_York',
    // Central
    AL:'America/Chicago', AR:'America/Chicago', IL:'America/Chicago', IA:'America/Chicago',
    LA:'America/Chicago', MN:'America/Chicago', MS:'America/Chicago', MO:'America/Chicago',
    OK:'America/Chicago', WI:'America/Chicago',
    // Mountain
    CO:'America/Denver', MT:'America/Denver', NM:'America/Denver', UT:'America/Denver', WY:'America/Denver',
    AZ:'America/Phoenix', // no DST; Navajo Nation observes DST — pin those clients in OVERRIDES
    // Pacific
    CA:'America/Los_Angeles', WA:'America/Los_Angeles',
    // Non-continental
    AK:'America/Anchorage', // western Aleutians (Adak) are America/Adak — pin if needed
    HI:'Pacific/Honolulu',
    // Split states — majority zone; refined by zip below:
    KY:'America/New_York',
    TN:'America/Chicago',
    FL:'America/New_York',
    IN:'America/Indiana/Indianapolis',
    MI:'America/Detroit',
    ND:'America/Chicago', SD:'America/Chicago', NE:'America/Chicago', KS:'America/Chicago',
    TX:'America/Chicago',
    OR:'America/Los_Angeles',
    ID:'America/Boise',
    NV:'America/Los_Angeles', // West Wendover is Mountain — pin if needed
  };

  /* =========================================================================
   * SPLIT-STATE ZIP3 REFINEMENT.
   * zip3 prefixes whose MAJORITY differs from the STATE_TZ default.
   * Known mixed prefixes that are deliberately NOT listed (pin in OVERRIDES):
   *   KY 427 / 426 / 401 — Leitchfield, Columbia, Russell Springs, Albany,
   *                        Burkesville, Hardinsburg are Central
   *   NE 691             — North Platte is Central; Ogallala/Sidney/Kimball Mountain
   *   KS                 — Sherman, Wallace, Greeley, Hamilton counties are
   *                        Mountain; their zip3s are majority Central
   *   MI 498 / 499       — Gogebic, Iron, Dickinson, Menominee counties are
   *                        Central; Houghton/Marquette/Escanaba are Eastern
   * ========================================================================= */
  const SPLIT_STATE_ZIP3 = {
    KY: { tz: 'America/Chicago', zip3: ['420','421','422','423','424'] }, // Paducah, Bowling Green, Owensboro, Henderson/Madisonville
    TN: { tz: 'America/New_York', zip3: ['373','374','376','377','378','379'] }, // Chattanooga, Tri-Cities, Knoxville
    FL: { tz: 'America/Chicago', zip3: ['324','325'] }, // Panama City, Pensacola
    IN: { tz: 'America/Chicago', zip3: ['463','464','476','477'] }, // Gary/Hammond, Evansville
    ID: { tz: 'America/Los_Angeles', zip3: ['835','838'] }, // Lewiston, Coeur d'Alene
    TX: { tz: 'America/Denver', zip3: ['798','799'] }, // El Paso / Hudspeth
    SD: { tz: 'America/Denver', zip3: ['577'] }, // Rapid City / Black Hills
    ND: { tz: 'America/Denver', zip3: ['586'] }, // Dickinson SW
    NE: { tz: 'America/Denver', zip3: ['693'] }, // Scottsbluff / Alliance panhandle
    OR: { tz: 'America/Boise', zip3: ['979'] }, // Malheur County (Ontario) -> Mountain
  };

  /* =========================================================================
   * DOM extraction. ConnectWise PSA is an SPA with churny class names, so we
   * match on visible LABEL text ("State:", "Zip:", ...) and read the field
   * that belongs to that label.
   * ========================================================================= */
  const CONTROL_SEL = 'input, select, textarea';
  const LABEL_SEL = 'label, span, div, td, th';

  function log(...a) { if (CONFIG.debug) console.log('[CW-TZ]', ...a); }

  function getFieldByLabel(root, label) {
    const labelLC = label.toLowerCase();
    for (const node of root.querySelectorAll(LABEL_SEL)) {
      if (node.closest('#' + BADGE_ID)) continue;
      // "state" / "state:" / "state*" — but not "real estate:"
      const t = (node.textContent || '').trim().toLowerCase().replace(/[:*\s]+$/, '');
      if (t === labelLC) {
        const val = readNearbyValue(node);
        if (val) return val;
      }
    }
    return null;
  }

  // Given a label element, return the value of the control that belongs to it.
  function readNearbyValue(labelNode) {
    // 1) explicit <label for=...>
    if (labelNode.htmlFor) {
      const v = valueOf(document.getElementById(labelNode.htmlFor));
      if (v) return v;
    }

    // 2) the matched node is a wrapper holding both the label text and its
    //    control (controls add no textContent, so the wrapper's text equals
    //    the label). Read the control inside it and stop: falling through to
    //    the sibling step would read the NEXT field's control.
    const inner = labelNode.querySelector(CONTROL_SEL);
    if (inner) return valueOf(inner);

    // 3) immediate sibling ("Label: value" in the same row, or a wrapper around the control)
    const sib = labelNode.nextElementSibling;
    if (sib) {
      const ctl = sib.matches(CONTROL_SEL) ? sib : sib.querySelector(CONTROL_SEL);
      const v = ctl ? valueOf(ctl) : (sib.textContent || '').trim();
      if (v && !/:\s*$/.test(v)) return v; // don't return the next field's label
    }

    // 4) walk up; take the FIRST control that follows the label in document
    //    order. Stop there even if it's empty — the next control belongs to a
    //    different field (e.g. City), and reading it would mis-resolve the tz.
    let scope = labelNode;
    for (let i = 0; i < 4 && scope; i++) {
      scope = scope.parentElement;
      if (!scope) break;
      for (const c of scope.querySelectorAll(CONTROL_SEL)) {
        if (labelNode.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) {
          return valueOf(c);
        }
      }
    }
    return null;
  }

  function valueOf(el) {
    if (!el) return null;
    if (el.tagName === 'SELECT') {
      const opt = el.options[el.selectedIndex];
      return opt ? (opt.textContent || opt.value || '').trim() || null : (el.value || '').trim() || null;
    }
    if ('value' in el && el.value != null && el.value !== '') return String(el.value).trim();
    const t = (el.textContent || '').trim();
    return t || null;
  }

  function extractAddress() {
    const root = document;
    const state = normalizeState(getFieldByLabel(root, 'State'));
    const zip = normalizeZip(getFieldByLabel(root, 'Zip'));
    if (!state && !zip) return null;
    const city = getFieldByLabel(root, 'City');
    const company = getFieldByLabel(root, 'Company');
    log('extracted', { company, city, state, zip });
    return { company, city, state, zip };
  }

  const STATE_NAMES = {
    'ALABAMA':'AL','ALASKA':'AK','ARIZONA':'AZ','ARKANSAS':'AR','CALIFORNIA':'CA','COLORADO':'CO',
    'CONNECTICUT':'CT','DELAWARE':'DE','FLORIDA':'FL','GEORGIA':'GA','HAWAII':'HI','IDAHO':'ID',
    'ILLINOIS':'IL','INDIANA':'IN','IOWA':'IA','KANSAS':'KS','KENTUCKY':'KY','LOUISIANA':'LA',
    'MAINE':'ME','MARYLAND':'MD','MASSACHUSETTS':'MA','MICHIGAN':'MI','MINNESOTA':'MN','MISSISSIPPI':'MS',
    'MISSOURI':'MO','MONTANA':'MT','NEBRASKA':'NE','NEVADA':'NV','NEW HAMPSHIRE':'NH','NEW JERSEY':'NJ',
    'NEW MEXICO':'NM','NEW YORK':'NY','NORTH CAROLINA':'NC','NORTH DAKOTA':'ND','OHIO':'OH','OKLAHOMA':'OK',
    'OREGON':'OR','PENNSYLVANIA':'PA','RHODE ISLAND':'RI','SOUTH CAROLINA':'SC','SOUTH DAKOTA':'SD',
    'TENNESSEE':'TN','TEXAS':'TX','UTAH':'UT','VERMONT':'VT','VIRGINIA':'VA','WASHINGTON':'WA',
    'WEST VIRGINIA':'WV','WISCONSIN':'WI','WYOMING':'WY','DISTRICT OF COLUMBIA':'DC',
  };

  function normalizeState(s) {
    if (!s) return null;
    s = s.trim().toUpperCase();
    if (s.length === 2) return s; // unknown codes (PR, GU...) fall through to the "add an override" badge
    return STATE_NAMES[s] || null;
  }

  function normalizeZip(z) {
    if (!z) return null;
    const m = String(z).match(/\d{5}/);
    return m ? m[0] : null;
  }

  /* =========================================================================
   * Timezone resolution: OVERRIDES -> split-state zip3 -> state default.
   * ========================================================================= */
  function resolveTimezone(addr) {
    if (addr.zip && OVERRIDES[addr.zip]) return { tz: OVERRIDES[addr.zip], src: 'override(zip)' };
    if (addr.company) {
      const key = addr.company.trim().toLowerCase();
      if (OVERRIDES[key]) return { tz: OVERRIDES[key], src: 'override(company)' };
    }
    if (addr.state && addr.zip && SPLIT_STATE_ZIP3[addr.state]) {
      const rule = SPLIT_STATE_ZIP3[addr.state];
      if (rule.zip3.includes(addr.zip.slice(0, 3))) return { tz: rule.tz, src: 'zip(split-state)' };
    }
    if (addr.state && STATE_TZ[addr.state]) return { tz: STATE_TZ[addr.state], src: 'state' };
    return null;
  }

  /* =========================================================================
   * Time evaluation in the contact's tz (DST-correct via Intl).
   * ========================================================================= */
  const WD = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };

  function partsOf(tz, opts, now) {
    const out = {};
    for (const p of new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).formatToParts(now)) {
      out[p.type.toLowerCase()] = p.value; // older engines emit 'dayperiod'
    }
    return out;
  }

  function contactClock(tz) {
    const now = new Date();
    // Logic: 24h clock, explicit h23 so midnight is 0 (not 24) everywhere.
    const logic = partsOf(tz, {
      weekday: 'short', hour: 'numeric', hourCycle: 'h23',
      year: 'numeric', month: 'numeric', day: 'numeric',
    }, now);
    const hour24 = parseInt(logic.hour, 10);
    const wd = WD[logic.weekday];
    const y = +logic.year, m = +logic.month, d = +logic.day;

    // Display: 12h clock with zone abbreviation.
    const disp = partsOf(tz, { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }, now);

    const isBusinessDay = CONFIG.businessDays.includes(wd);
    const isBusinessHour = hour24 >= CONFIG.businessStartHour && hour24 < CONFIG.businessEndHour;

    return {
      label: `${disp.weekday} ${disp.hour}:${disp.minute} ${disp.dayperiod || ''}`.trim(),
      abbr: disp.timezonename || tz,
      open: isBusinessDay && isBusinessHour,
      isBusinessDay, hour24,
      holiday: CONFIG.holidayBanner ? holidayOn(y, m, d) : null,
    };
  }

  /* =========================================================================
   * Holiday resolution (pure date math in UTC — no timezone involved; the
   * contact-local Y/M/D is passed in).
   * ========================================================================= */
  const pad = (n) => String(n).padStart(2, '0');
  const dateKey = (dt) => `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  const utc = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
  const addDays = (dt, n) => new Date(dt.getTime() + n * 86400000);

  function nthWeekday(y, m, wd, n) {
    if (n > 0) {
      const first = utc(y, m, 1);
      return addDays(first, ((wd - first.getUTCDay() + 7) % 7) + (n - 1) * 7);
    }
    const last = utc(y, m + 1, 0); // day 0 of next month = last day of this month
    return addDays(last, -((last.getUTCDay() - wd + 7) % 7));
  }

  function easterSunday(y) { // Anonymous Gregorian algorithm
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    return utc(y, Math.floor((h + l - 7 * m + 114) / 31), ((h + l - 7 * m + 114) % 31) + 1);
  }

  const holidayCache = {};
  function holidaysFor(y) {
    if (holidayCache[y]) return holidayCache[y];
    const out = {}, byId = {};
    const add = (k, name) => { out[k] = out[k] ? `${out[k]} / ${name}` : name; };
    for (const r of HOLIDAY_RULES) {
      let dt = null;
      if (r.fixed) dt = utc(y, r.fixed[0], r.fixed[1]);
      else if (r.nth) dt = nthWeekday(y, r.nth[0], r.nth[1], r.nth[2]);
      else if (r.easter != null) dt = addDays(easterSunday(y), r.easter);
      else if (r.offset && byId[r.offset[0]]) dt = addDays(byId[r.offset[0]], r.offset[1]);
      if (!dt) continue;
      byId[r.id] = dt;
      if (!r.on) continue;
      add(dateKey(dt), r.name);
      if (r.observe) {
        const dow = dt.getUTCDay();
        const shift = dow === 6 ? -1 : dow === 0 ? 1 : 0;
        if (shift) add(dateKey(addDays(dt, shift)), `${r.name} (observed)`);
      }
    }
    return (holidayCache[y] = out);
  }

  function holidayOn(y, m, d) {
    const k = `${y}-${pad(m)}-${pad(d)}`;
    if (CUSTOM_HOLIDAYS[k]) return CUSTOM_HOLIDAYS[k];
    // Check next year too: Jan 1 on a Saturday is observed Dec 31.
    const hits = [holidaysFor(y)[k], holidaysFor(y + 1)[k]].filter(Boolean);
    return hits.length ? hits.join(' / ') : null;
  }

  /* =========================================================================
   * Badge UI
   * ========================================================================= */
  const BADGE_ID = 'cw-tz-badge';
  let lastHtml = null;

  function positionStyle() {
    const gap = '12px';
    switch (CONFIG.position) {
      case 'top-left': return `top:${gap};left:${gap};`;
      case 'bottom-right': return `bottom:${gap};right:${gap};`;
      case 'bottom-left': return `bottom:${gap};left:${gap};`;
      default: return `top:${gap};right:${gap};`;
    }
  }

  function getBadge() {
    let el = document.getElementById(BADGE_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = BADGE_ID;
      el.style.cssText = `
        position:fixed; ${positionStyle()} z-index:2147483647;
        font-family: 'Segoe UI', Arial, sans-serif; font-size:12px; line-height:1.35;
        padding:10px 12px; border-radius:8px; color:#fff; max-width:280px;
        box-shadow:0 3px 12px rgba(0,0,0,.28); cursor:default; user-select:none;
        transition: background .2s ease; display:none;`;
      (document.body || document.documentElement).appendChild(el);
      lastHtml = null;
    }
    return el;
  }

  // Only touch the DOM when something actually changed — rewriting innerHTML
  // every tick would re-trigger the MutationObserver and spin forever.
  function paint(el, bg, html, title) {
    if (html === lastHtml) return;
    lastHtml = html;
    el.style.background = bg;
    el.innerHTML = html;
    el.title = title || '';
    el.style.display = 'block';
  }

  function renderBadge(state) {
    const el = getBadge();

    if (!state) {
      if (el.style.display !== 'none') el.style.display = 'none';
      lastHtml = null;
      return;
    }

    if (state.error) {
      paint(el, '#607d8b',
        `<div style="font-weight:600;">🕐 Timezone unknown</div>
         <div style="opacity:.9;margin-top:2px;">${escapeHtml(state.error)}</div>`);
      return;
    }

    const { clock, addr, src } = state;
    const where = [addr.city, addr.state].filter(Boolean).join(', ');
    // red = closed, amber = open but holiday, green = open
    const bg = !clock.open ? '#c62828' : clock.holiday ? '#b45309' : '#2e7d32';
    const holidayHtml = clock.holiday
      ? `<div style="background:rgba(0,0,0,.22);border-radius:5px;padding:6px 8px;margin-bottom:6px;">
           <div style="font-weight:700;">📅 ${escapeHtml(clock.holiday)}</div>
           <div style="opacity:.95;">${escapeHtml(CONFIG.holidayMessage)}</div>
         </div>`
      : '';
    paint(el,
      bg,
      `${holidayHtml}<div style="font-weight:700;font-size:13px;">${clock.open ? '✅ Within business hours' : '⛔ OUTSIDE business hours'}</div>
       <div style="margin-top:4px;">Contact local time:<br><b>${escapeHtml(clock.label)} ${escapeHtml(clock.abbr)}</b></div>
       <div style="opacity:.85;margin-top:4px;">${escapeHtml(where)} · ${escapeHtml(src)}</div>`,
      `Timezone resolved via ${src}. Business hours: ${CONFIG.businessStartHour}:00–${CONFIG.businessEndHour}:00, Mon–Fri, contact-local.`);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
    ));
  }

  /* =========================================================================
   * Main loop
   * ========================================================================= */
  function tick() {
    const addr = extractAddress();
    if (!addr) { renderBadge(null); return; }
    const tz = resolveTimezone(addr);
    if (!tz) {
      renderBadge({ error: `Couldn't map ${addr.state || '?'} / ${addr.zip || '?'} to a timezone. Add it to OVERRIDES.` });
      return;
    }
    const clock = contactClock(tz.tz);
    // Stay quiet only on a normal open day; holidays always show the banner.
    if (CONFIG.warnOnlyWhenClosed && clock.open && !clock.holiday) { renderBadge(null); return; }
    renderBadge({ clock, addr, src: `${tz.tz} (${tz.src})` });
  }

  // Debounced re-run on SPA DOM changes (ticket switches without full reload).
  // Ignore mutations that originate inside our own badge.
  let pending = null;
  const observer = new MutationObserver((mutations) => {
    const badge = document.getElementById(BADGE_ID);
    if (badge && mutations.every((m) => badge.contains(m.target))) return;
    if (pending) return;
    pending = setTimeout(() => { pending = null; tick(); }, 400);
  });

  function boot() {
    tick();
    setInterval(tick, CONFIG.refreshMs);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    log('booted');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

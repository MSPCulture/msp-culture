# Disaster Recovery Intake Workbook

A self-guided intake workbook that collects everything an organization needs before writing a disaster recovery plan, built for MSPs to hand to client IT teams.

A DR plan is only as good as the information behind it. This workbook gets the business requirements, technical inventory, backup reality, people, and third parties into one place, and it flags the gaps most likely to turn an outage into a disaster while the client is still filling it in.

**Download:** [Disaster_Recovery_Intake_Workbook_v1.0.xlsx](Disaster_Recovery_Intake_Workbook_v1.0.xlsx) (or grab it from the [v1.0 release](https://github.com/MSPCulture/msp-culture/releases/tag/disaster-recovery-intake-v1.0))

> **Contains sensitive information once completed.** A filled-in copy holds contacts, IP addresses, account numbers, and the location of privileged credentials. Store and share it the way you would the DR plan itself. The workbook tells users never to record passwords or secrets in it.

## What's in it

| Tab | Captures |
|---|---|
| Start Here | Instructions, legend, tab owners, progress tracker, and a live Readiness Snapshot |
| 1 Org Profile | Scope, disaster declaration authority, regulatory drivers, cyber insurance conditions |
| 2 Business Impact | Business functions, impact ratings, MTD / RTO / RPO, manual workarounds |
| 3 Critical Apps | Applications, business and technical owners, tiers, dependencies, restore order |
| 4 Data Inventory | Where data lives, data owners, classification, retention, legal hold |
| 5 Infrastructure | Servers, hypervisors, storage, network gear, cloud tenants, recovery method |
| 6 Network | Circuits, VPN, DNS, registrar, certificates, email routing, telephony |
| 7 Backups | Backup jobs, immutability, domain separation, restore testing, RPO / RTO gap checks |
| 8 Break-Glass Access | Privileged and emergency accounts, where credentials live, offline reachability |
| 9 Internal Contacts | Recovery team, DR roles, out-of-band contact info, declaration and spending authority |
| 10 Vendors | Third parties, account numbers, support and escalation, contract expiry |
| 11 Recovery Sites | Alternate locations, recovery regions, spare hardware, procurement sources |
| 12 Communications | Who notifies whom, how, and with whose approval |
| 13 Gaps & Actions | Unknowns and findings; becomes the remediation roadmap |

## What makes it more than a form

- **Business requirements drive the technical answers.** RTO and RPO come from department heads on the Business Impact tab, not from whatever the backup schedule happens to be.
- **Automatic gap checks.** Pick an application on the Backups tab and its required RPO / RTO pull across. The row flags when backup frequency or measured restore time misses the requirement, and when a restore test is missing or stale.
- **Readiness Snapshot.** 17 checks roll up on the Start Here tab, including apps with no owner or no backup, backups with no immutable copy, backup consoles tied to the production domain, break-glass accounts unreachable when the IdP is down, and too few people authorized to declare a disaster.
- **Cyber insurance built in.** Captures the carrier hotline, panel IR firm and breach counsel, and the policy conditions that can void coverage if reality doesn't match the application.
- **"Unknown" is a valid answer.** Unknowns are logged as findings instead of stalling the work.
- **Tunable.** Tier cutoffs, restore-test age, and the expiry warning window are editable on the Lists tab.
- **White-label ready.** Logo drop zone on Start Here. Enter "Prepared for" once and the client's name appears in every tab title.

## How to use it

1. Fill in **Prepared by / Prepared for** and drop your logo on the Start Here tab.
2. Send it to the client's IT lead and assign an owner for each tab. Tabs 2, 4, and 9 need department heads, not just IT.
3. Review the Readiness Snapshot and the Gaps & Actions tab together. That conversation is where the DR plan, and usually the remediation project, starts.

## Requirements

Microsoft Excel 2010 or later (also works in LibreOffice Calc). No macros, no external connections, no add-ins. Excel will open a downloaded copy in Protected View; click **Enable Editing** to fill it in.

## Verify your download

| File | SHA-256 |
|---|---|
| Disaster_Recovery_Intake_Workbook_v1.0.xlsx | `7bf31a9343d780fb2536c17ff0f5c326359c6732f5d1f4cddd6cca5392cb01c1` |

Windows (PowerShell):

```powershell
Get-FileHash .\Disaster_Recovery_Intake_Workbook_v1.0.xlsx -Algorithm SHA256
```

macOS / Linux:

```bash
shasum -a 256 Disaster_Recovery_Intake_Workbook_v1.0.xlsx
```

## Terms of use

See [LICENSE.md](LICENSE.md). In short: free to use, modify, and brand as your own deliverable to your clients. Don't resell it or republish it, and keep the "Powered by MSP Culture" credit.

## Changelog

- **v1.0 (October 2026):** Initial release.

---

Powered by MSP Culture

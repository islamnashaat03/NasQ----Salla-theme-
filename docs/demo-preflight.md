# Salla demo preflight — 2026-09-30

Status: BLOCKED — local candidate is not deployed to the selected portal branch.

Official workflow reviewed: https://docs.salla.dev/421879m0

Observed in authenticated Chrome:
- Theme: NASQ, ID 1850944111.
- Repository: https://github.com/islamnashaat03/NasQ----Salla-theme-
- Selected branch: codex/nasq-demo-candidate.
- Portal lists 18 custom components, including home.nasq-hero, not home.nasq-hero-100.
- Portal header layout setting is nasq_header_layout; local candidate uses header_layout.
- Demo store nasq-demo-new exists.

Local candidate: 55 settings, 3 components. Existing validation and asset-copy build pass.
No portal settings were saved, no publication request was sent, and no UI feature is marked demo-verified.

Next: upload the candidate to a separate codex/nasq-builder-test branch, select it in Partners, verify synchronized settings/components, and preview on nasq-demo-new. Then test header/footer layouts, logo controls, Hero 100 modes and responsive behavior.

## Deployment update

- Uploaded independent candidate to codex/nasq-builder-test, commit 53aa1e9.
- Selected and confirmed codex/nasq-builder-test in Partners.
- Portal still displayed the previous 18 components immediately after selection; synchronization is not verified yet.
- Sending this record update after branch selection to exercise the selected branch webhook.

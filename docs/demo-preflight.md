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

## Verified portal sync and preview attempt

- Latest code fix: e51959f (documented root metadata).
- Partners confirms 3 components, including Hero 100 at home.nasq-hero-100, and 7 enabled features. Built-in home features are disabled.
- Partners settings page confirms header_layout, footer_layout, header_custom_logo and footer_custom_logo.
- Preview drafts on nasq-demo-new omit custom components and options. An earlier draft rendered Twilight Error 422: File [src/views/pages/index.twig] Not Found, although Git contains that exact path. Cause remains unconfirmed.
- Official Salla CLI 3.2.56 preview command is available. Started preview for nasq-demo-new with editor and link-only options.
- CLI now waits for explicit authorization on the official Partners auth/cli page; no authorization was granted by the agent.
- UI feature tests remain pending. Portal schema synchronization is verified, storefront behavior is not.
- Official CLI preview reference: https://docs.salla.dev/422776m0

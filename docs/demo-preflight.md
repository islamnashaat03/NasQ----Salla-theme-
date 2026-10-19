# Salla demo preflight — 2026-09-30

Status: PARTIAL RECOVERY — component identity defect fixed; new draft exposes custom components and Hero settings. Full storefront feature tests remain pending. See latest dated entry.

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

## CLI authentication and watcher verification

- Salla CLI authentication succeeded after renewed authorization; linked GitHub account, theme ID and repository checks passed.
- Added watch script using the official Twilight WatcherPlugin and webpack. Contract validation runs before compilation. Installed a local pnpm launcher under ignored .tools.
- Production validation passes: 15 review records, 55 settings, 3 components.
- CLI preview starts asset server at localhost:8000 and websocket at localhost:8001; official watcher connects and webpack compiles successfully.
- Active test draft: 1088349143, theme 1850944111, store 1592857134 (nasq-demo-new).
- Storefront still reports 422 / src/views/pages/index.twig Not Found. Custom home components are absent from the draft editor.
- IMPORTANT: official `salla theme sync` returns process status 0 even when the upload fails. Initial helper progress lines were not evidence of successful uploads. Capturing its response confirmed an error in Arabic (unexpected error) for homepage upload; absolute file paths produce the same response.
- Synchronization into the draft remains failed; no UI features have passed demo tests. Portal schema synchronization and local watcher startup are verified separately.

## Retest — 2026-10-03

- Reviewed official preview documentation again: https://docs.salla.dev/422776m0.
- Partners still selects codex/nasq-builder-test and displays 3 components / 7 features.
- New portal draft: 1053532842. New authenticated CLI draft: 143704491. Both editors omit custom home components.
- Fixed the local ignored CLI launcher: preview internally invokes `salla theme serve`, which requires a `salla` executable on PATH, even when the parent CLI was launched through node. Assets / websocket servers and webpack watcher now start successfully.
- Instrumented only the installed CLI error handler in memory to report safe HTTP status, error code and message. No source theme files were changed by diagnostics.
- Homepage upload fails on both the previous draft and the refreshed CLI draft: HTTP 417, code `error`, message `حصل خطأ غير متوقع!`.
- Confirmed src/views/pages/index.twig and the other 11 Twig templates are tracked in commit bc1f037.
- Current preview frame is blank; do not carry forward the earlier 422 as today's rendered result.
- Related public reports exist, but neither establishes the cause of this instance: https://github.com/SallaApp/Salla-CLI/issues/138 and https://github.com/SallaApp/Salla-CLI/issues/134.
- Prepared docs/salla-support-diagnostic.md for user handoff. Nothing was sent to support.
- Header / footer / Hero 100 UI and mobile tests remain pending until the draft receives the files and schema.

## Retest — 2026-10-10

- Fresh authenticated CLI draft: 1676976796, same theme and demo store.
- Local production validation/build still pass (15 records, 55 settings, 3 components).
- Unlike October 3, all 12 Twig files and both translation files now receive explicit `is synced successfully` responses. HTTP 417 was not reproduced for these uploads.
- Root twilight.json upload fails: `The path field is required.` The official CLI sends an empty directory for root files. A temporary in-memory diagnostic using `.` as root receives HTTP 422 / `Paths with dots not allowed.` No theme source was modified.
- After reloading, the editor still omits custom components; the preview explicitly reports HTTP 422 / `File [src/views/pages/index.twig] Not Found`, despite the accepted upload response.
- Saved local screenshot: docs/demo-retest-2026-10-10.png. UI feature tests remain pending. Upload acknowledgement alone does not establish working draft rendering.

## Diagnosis and recovery — 2026-10-20

- Initial fresh CLI preview explicitly rejected twilight.json: `Custom component must have (title, key, fields, path)`.
- All three local components lacked key. Compared the official example linked from docs.salla.dev/421921m0; current reference components use stable UUID keys.
- Registered review before adding stable keys and local validation for missing/duplicate identities. Local checks previously missed this requirement.
- Validated and pushed fix 613698f to codex/nasq-builder-test.
- Retried official CLI: accepted preview, draft 24790961. The editor now lists Hero 100, Store Features and Banner Grid.
- Opened Hero 100: height/mobile height, background selector/image/video/slide collections, overlay, alignment, text and buttons are visible in the form. No test content was saved.
- Current preview renders a demo storefront; this alone does not verify NASQ-specific storefront behavior. End-to-end save/render, header/footer and mobile tests remain pending.
- Evidence saved locally: docs/hero-settings-2026-10-20.png.
- Missing keys are a confirmed project defect and current preview blocker resolved by the change. This does not prove they caused every historical HTTP 417 response.

## Builder implementation and save test — 2026-10-20

- Pushed runtime fixes fa98f2a: normalize dropdown arrays in header/footer/Hero, preserve zero overlay opacity, preserve footer logo colors, align Hero buttons, improve mobile layout and keyboard navigation.
- Local navigation regression checks pass for opening, Escape/focus restoration, link selection, outside click and breakpoint reset. Production gate passes with 18 review records, 55 settings and 3 components after subsequent schema fix.
- Draft 757958067 reproduced the missing homepage template even after explicit success responses for all Twig and locale uploads. Root twilight.json upload still rejects an empty path.
- Demo Hero save initially failed: image and video slide collections both required their first empty media item, even with image background selected.
- Pushed 688315d: optional collections allow zero entries; validator prevents positive minimum lengths on optional collections. Salla still seeds one blank item in its form, but now exposes removal controls.
- Fresh draft 2131403964: removed the two unused blank slide items, set title `اختبار NASQ — Hero 100`, opacity 0 and one button. The editor displayed `حُفظت التغييرات بنجاح.` and added Hero 100 to the page (instance 2139582703).
- Reopened that instance: the saved title appears in its heading. Test content is intentionally retained on nasq-demo-new only.
- Saved evidence docs/hero-save-verified-2026-10-20.png. This verifies editor save, not storefront rendering. Background media playback, actual responsive rendering and header/footer visual tests remain unverified because of the preview template error.

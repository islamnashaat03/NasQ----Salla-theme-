# Salla demo preflight — 2026-09-30

Status: STYLED DESKTOP PREVIEW VERIFIED — after user allowed device access, the NASQ header, saved Hero and footer render with theme styling. Broader feature/mobile tests remain pending. See latest dated entry.

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

## Confirmed rendering cause and fix — 2026-10-20

- Updated isolated official CLI from 3.2.56 to 3.2.63. Update alone did not fix rendering. Confirmed remote Git branch and generated preview tag point to the intended commit.
- Inspected the actual preview HTTP response: a 110-byte HTML comment reported `Array to string conversion in File [src/views/layouts/master.twig] at line 16.` The visible missing-file screen did not reveal this underlying render exception.
- A temporary demo-only index diagnostic emitted only the public radius enum setting. Observed shape: `{"value":[""],"source":null}`. Restored and re-uploaded the original homepage immediately after diagnosis.
- Fix 05852fe unwraps the value wrapper, the selected array item and optional option.value before CSS/class output, with scalar defaults. Applied to master radius/container, header/footer layouts/logo sources, header alignment and Hero selectors/button style. Removed duplicate CDN transformation from the font URL.
- Verified actual live draft HTML contains nasq-theme and the saved Hero title, link, header and footer; HTML size 44,524 bytes rather than the error comment. This confirms the template executes, independently of upload acknowledgements.
- Added local regression gate rejecting direct output of `items` theme settings. Positive fixture passes; a fixture with direct nasq_radius interpolation fails with the expected diagnostic.
- Separate browser blocker: CSS/JS requests to localhost:8000 fail with `LocalNetworkAccessPermissionDenied`. Full visual verification requires the browser's local-network permission. No protection was disabled.
- Preview with local parameters cleared fell back to an older render state; it is not a verified workaround. Current fresh CLI draft is 1646816954; all Twig/locales received explicit success responses.
- Portal remote-preview attempt stopped at Cloudflare automatic security verification; no challenge was solved or bypassed.

## Device access enabled by user — 2026-10-20

- User enabled Apps on device for salla.design, then reported completion.
- Reloaded the existing storefront; verified styled header, Hero 100 title/button and footer visually. NASQ styles now apply in Chrome.
- Measured saved Hero height: 720 CSS pixels; overlay computed opacity: 0. Saved title matches the editor test.
- Local assets endpoint responds HTTP 200. No new permission changes were performed by the agent.
- Evidence: docs/nasq-styled-preview-2026-10-20.png.
- Full media modes, mobile layouts, cart and checkout workflows remain unverified; this entry confirms restored styled desktop preview only.

## Interaction and media QA — 2026-10-20

- Chrome extension testing on nasq-demo-new: search for `فستان` returned product results; account opened the official login modal without submitting credentials. Empty cart rendered; continue-shopping now returns to the storefront after the fallback fix.
- Earlier mobile check at 390x844: navigation opened, Escape closed it and restored focus; saved Hero height was 560px, zero overlay preserved, no horizontal overflow. A later viewport override did not change the measured storefront width; do not count it as mobile slider verification.
- New Hero instances persist the selected background mode after the Manual dropdown source fix. Existing instances can retain the old field schema; migration/recreation remains a follow-up.
- Temporary instance 52765340 verified all four background modes: direct video loaded (readyState 4) and played when visible; two video slides initialized and pagination selected the second slide; two distinct gallery images loaded and pagination selected the second image; a standalone gallery background image loaded successfully after save.
- Discovered carousel gaps: 487px video inside a 720px Hero plus side gutters. Scoped wrapper styles now produce a full 720px video/image height. Fresh official draft 1914100118 confirmed this rendered correction.
- Discovered empty slider ID suffix from component.id. Used the official theme-raed per-instance position pattern; fresh draft emitted nasq-hero-videos-3 and nasq-hero-images-3. Earlier sync acknowledgement alone did not update the prior rendered version.
- Removed temporary instance 52765340 after QA. Its homepage links are absent; original Hero 2139582703 and existing page components retained.
- Known editor friction: empty optional collection rows are reinserted on opening/saving; remove unused blank button/slide rows to save. This is not resolved by minLength 0 alone.
- Console is not clean: Salla preview telemetry POST /_app/e/api/s/page returns 405, plus browser extension asynchronous message warnings. No framework error overlay or blank page observed during the media tests.
- Local production passes: 24 reviewed artifacts, 55 settings, 3 components. Navigation and unsafe-dropdown regression checks pass. Fix commit 1af05fe pushed to codex/nasq-builder-test.
- Remaining: mobile slider coverage, header/footer option combinations and logo swaps, populated cart/product options/checkout. Maintenance notice remains present; no order/payment was placed. Browser plugin absent; used the existing authenticated Chrome extension CUA session.
- Screenshot evidence from prior checks is outside the repo in %TEMP%/nasq-qa-20261020 (search.png, mobile-hero.png).

## Builder settings and mobile video slider — 2026-10-20

- Reviewed official header, footer and slider references: https://docs.salla.dev/422601m0, https://docs.salla.dev/422602m0, https://docs.salla.dev/422735m0. No theme source/schema changes in this run.
- Authenticated Chrome extension QA: saved header centered, two-rows and split layouts; observed corresponding storefront classes. Classic layout was the baseline and restored afterward. Saved centered, compact and brand-first footer layouts; observed matching classes. Compact footer omitted contact links as intended.
- Header text logo and existing custom uploaded logo rendered. Footer text logo rendered after saving the selected source. Search visibility toggle removed and restored the search button.
- Numeric editor interaction initially concatenated the typed height to the old value (8496). Corrected using select-all/backspace and explicit typing; confirmed the saved CSS variable was 96px. This was a test-input correction, not a theme code fix.
- The required radius dropdown was initially unset. Selected Medium (16px), matching the runtime fallback, to permit saving. This explicit default remains on the demo.
- Used tab-scoped Chrome device emulation after browser-wide viewport override had failed to affect the actual page. Measured innerWidth 390, visualViewport.width 390 and scrollWidth 390.
- Temporary Hero 1731391542 (`NASQ Mobile Slider QA`): two video slides, both URLs loaded. At 390x844, slider and video heights were both 560px. Clicking second pagination bullet activated index 1; its video had readyState 4 and was playing. Screenshot: C:/Users/Q/AppData/Local/Temp/nasq-qa-20261020/mobile-video-slider.png.
- Removed temporary Hero and verified its title absent from the storefront. Restored classic header, columns footer, original store-logo sources, header height 84px and search enabled. Kept original custom-logo file and original Hero. Cleared device emulation (normal page width 929).
- Still unverified: mobile image slider specifically, footer custom image replacement, full combinations of colors/spacing/tools, populated cart and checkout. Existing empty optional-row editor behavior and preview telemetry errors remain documented above.

## Populated cart QA and contract fix — 2026-10-21

- Search results link to demostore.salla.sa, which renders the public theme. Opened the observed product path under salla.design to verify NASQ specifically; do not count public-theme behavior as NASQ QA.
- NASQ product 883575378 rendered seven image controls, size options and quantity. Required size left unselected prevented submission and focused the selector. Selected 40 - M and quantity 2; cart later confirmed two units totaling 348. An alert appeared despite persisted success; its message was not available through the browser dialog API. This notification behavior remains unresolved.
- Confirmed project defect on the populated cart: blank product name/image and selected option. Official linked theme-raed cart uses item.product_name/item.product_image; official options partial uses salla-product-options with selected option details. Registered review before correcting these fields.
- Production validation/build pass with 25 review records, 55 settings and 3 components. Official CLI explicitly accepted cart.twig synchronization. Reloaded live cart confirmed name `فستان`, loaded image and selected `40 - M`.
- Quantity increase persisted from 2 to 3 and total from 348 to 522 after reload. An alert also appeared on update. Clicking checkout reached the store's maintenance page, so checkout/payment/thank-you QA is blocked by that store state; no order was submitted.
- Deleted the test cart item and reloaded: zero count and empty-cart state confirmed. Delete also produced an alert before reload; live summary/notification refresh needs follow-up.
- Preview asset server was stopped; restarted official CLI `theme serve` on localhost:8000/8001. Browser still reports app.css stylesheet unloaded and websocket connection errors. Screenshot C:/Users/Q/AppData/Local/Temp/nasq-qa-20261021/cart-fixed.png proves content only, not visual layout. Do not claim responsive/visual QA passed in this run.
- Still pending: mobile image slider, multiple sliders together, remaining builder combinations, coupon UI (not offered by current cart settings), stable cart notifications/live totals, checkout after maintenance is removed, English/LTR and tablet.

## Notifications and cart refresh verified — 2026-10-21

- Official Notify API (https://docs.salla.dev/422615m0) explicitly states that alert() is the default notifier, including success messages. Earlier cart alerts were not evidence that mutations failed.
- Registered review before adding a string-message notifier through salla.onReady/setNotifier. Messages use textContent, translated dismiss labels and status/alert roles; non-string payloads retain the SDK's native alert fallback.
- Live product add displayed `تمت إضافة المنتج بنجاح` in the new toast, without a JavaScript alert. Live quantity update displayed `تم تحديث البيانات بنجاح`. Screenshot: C:/Users/Q/AppData/Local/Temp/nasq-qa-20261021/cart-notification.png.
- Reproduced stale server-rendered cart totals after quantity changes. Added a gated cart updated listener: reload only when an actual cart form change is awaiting confirmation. Initial summary events do not trigger reload. Confirmed deletion now reloads the whole cart state rather than only removing the row.
- Live retest without manual reload: quantity 1 to 2, item total 174 to 348, summary total 348 and count 2. Deleting the test item automatically displayed the empty state and count zero. No order/payment submitted.
- Local VM regression checks passed for initial-update reload suppression, single confirmed-change refresh, literal markup rendering, dismissal and native non-string fallback. Existing navigation/dropdown checks pass.
- Started the official CLI serve command as a hidden background process after terminal-scoped servers stopped. Confirmed listener PID 151668 on 8000 and HTTP 200 /app.css (15861 bytes at that check). Styled cart is now visually verified; screenshot C:/Users/Q/AppData/Local/Temp/nasq-qa-20261021/cart-styled-fixed.png. The browser helper's link.sheet readings remained false even while styling visibly applied; use actual rendering/computed state for further QA.
- Production passes: 27 review records, 55 settings, 3 components. Remaining QA: mobile image/multiple-slider scenarios, remaining builder settings, English/LTR/tablet and checkout after maintenance is removed. Existing font URL issue and optional blank editor rows remain separate follow-ups.

## Mobile image sliders and tablet — 2026-10-21

- Reopened known draft 1914100118: plain editor/homepage initially showed no custom components, while the explicit draft restored the expected NASQ schema and original entries. No component data was lost.
- Created disposable image Hero 1847827486 with two different existing gallery images and autoplay off; duplicated as 791569765. Both rendered on the demo with distinct IDs nasq-hero-images-3 and nasq-hero-images-4.
- At measured innerWidth 390 and scrollWidth 390, both sliders and their loaded images were 560px high. Initial pagination click failed: the full-height content layout intercepted background controls, which were also incorrectly inside aria-hidden media.
- Reviewed slider documentation and registered the fix before changes. Inner layout now passes pointer events through except its actual content; interactive image/video slider media is no longer aria-hidden. Decorative standalone image/video media remains hidden from assistive technology.
- Live post-fix test: first slider's Go to slide 2 click yielded indices [1, 0]. Pressing Enter on the second slider's same control yielded [1, 1]. This proves independent pointer/keyboard pagination without autoplay masking the result.
- Tablet 768x1024: measured innerWidth and scrollWidth both 768, both sliders 560px high. Cleared device emulation after testing.
- Evidence outside repo: C:/Users/Q/AppData/Local/Temp/nasq-qa-20261021/mobile-image-sliders.png and tablet-image-sliders.png.
- Temporarily enabled the header localization tool. Its modal offered three currencies but no language choices; English/LTR switching is not verified because English is not offered by this demo configuration. Closed without changing currency and restored header_show_language=false.
- Cleanup initially paused when automatic approval review could not run because of usage limits; the delete action was not executed then. After the user's continuation and restored review availability, removed both disposable Heroes. Verified only original entry IDs 1484722813, 109112825, 2139582703 remain.
- Remaining: English/LTR after language availability is configured, remaining builder combinations/footer custom image, optional blank-row editor behavior, font URL, checkout/payment after maintenance is removed. Current run does not establish exhaustive device/browser coverage.

## NASQ Questions component — 2026-10-21

- User clarified that the requested component is text questions/answers, not a branching product quiz. Reviewed custom component/schema docs and registered implementation before edits. New independent path home.nasq-questions, stable key e3aee6f5-853c-4481-a51b-acbe20e383ad; existing bundled FAQ was not modified.
- Merchant controls: questions/answers, title/description, initial first/all/none state, multiple-open switch, separate open/closed icon selections and position, icon/title/question/body colors, section/item/border backgrounds, section vertical padding/margins, item padding, item/text/heading gaps, corner radius, icon size and duration 0–1500ms. Numeric output is bounded and explicit zeros preserved.
- Native details/summary supplies keyboard and no-script disclosure behavior. Enhanced animation cancels superseded transitions, honors reduced motion and supports exclusive opening. Content uses escaped text, preserving answer line breaks; no raw/merchant HTML.
- Pushed candidate 36f4ed5 and created official draft 1458891993. Editor displayed NASQ Questions. Synced all 13 Twig templates and both locales after initial draft homepage missing-template screen. Actual standalone storefront subsequently rendered the new component.
- Saved instance 1774974209 with title `قبل ما تطلب` and two test shopping questions. Retained on the authorized demo as a reviewable new component. Original page entries retained.
- Verified first-open [true,false], keyboard Enter opens second, multiple-open [true,true], repeated open/close leaves consistent state. Reopened editor and saved all-open [true,true] and all-closed [false,false].
- Verified persisted custom icon/title/text colors (rgb 155/59/49, 37/75/64, 64/86/107), chevron icons and icon-before-question placement. Zero duration and zero section top padding remained 0; custom item gap 24px, item padding 30px, section margin-top 18px and answer gap 16px all matched computed values.
- Exclusive mode opening second closed first [false,true]. Returned demo to first-open, 280ms motion and standard spacing, retaining the custom colors/icons and exclusive mode for review.
- Mobile measured viewport/content/scroll widths all 390px; open/close and keyboard interaction passed. Emulated reduced motion ended with closed/open states and cleared transition styles; removed media and device emulation afterward.
- Evidence: C:/Users/Q/AppData/Local/Temp/nasq-qa-20261021/questions-mobile.png. Local questions regression checks cover exclusive/multiple mode, interrupted toggles, independent instances, zero-duration and reduced motion. Navigation/notifier/dropdown checks also pass. Production: 29 review records, 55 global settings, 4 components.
- Scope limits: colors/initial modes/spacing were tested on the Arabic demo; English storefront switching remains unavailable there. No additional production store publication or payment actions performed.

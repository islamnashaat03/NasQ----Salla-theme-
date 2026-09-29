# NASQ — candidate for demo testing (2026-09-19)

## Status

Local schema checks and production build are required before packaging.
Webpack compiles JS/SCSS, NOT Twig. The local checks do not certify Salla's
server-side Twig rendering, merchant editor persistence, or product API.
This is a demo-test candidate, not a certified marketplace release.

## Changes

- Icon picker format corrected; product dropdowns initialized.
- Manual single-select defaults/keys initialized and Twig values normalized.
- Occasion subtitle; product grid/slider; paired/static banners and banner slider.
- Testimonials carousel with responsive card widths.
- Footer custom colors take precedence over light-mode styles; icons no longer
  recolor contact text; logo alignment normalized.
- Removed global content-visibility that can interfere with slider measurement.
- Added effective preset styling and archive layout behavior.
- Escaped selected-product JSON attributes; accepts product objects or scalar IDs.

## Upload / preview

1. Back up the current theme and demo homepage configuration.
2. Extract this source snapshot into the existing theme project. Preserve your
   Git configuration and Salla CLI login. Do not upload node_modules.
3. Use Node compatible with package.json engines and the committed pnpm lockfile.
   Install dependencies with pnpm install --frozen-lockfile, then run pnpm test.
4. Use the Salla Partners test-theme preview workflow for the linked repository,
   or your already-configured Salla CLI preview. Do not publish to a live store.
5. This local checkout had diverged history (ahead 2 / behind 2). Reconcile the
   remote branch before pushing; never force-push this snapshot over it.

## Demo acceptance checklist

- Add a fresh instance of each custom component and save it.
- Also test existing saved instances: preserve their content before changing them.
- Visual cards: select 2, 3, 4 columns, save, reload; verify desktop column count
  and two-column mobile layout. No required-field error.
- Icon features: open picker, choose icon, save, reload.
- Shop the look + product grid/slider: search real demo products, select, save,
  reload, verify product names/links and add-to-cart behavior.
- Occasion: main title, section subtitle and per-card subtitle all appear.
- Banners: one static, two paired, multiple sliding; verify links and uncropped
  artwork on desktop/mobile; check empty optional titles.
- Testimonials: one and multiple entries, long text, missing optional name.
- Footer: custom colors with dark toggle both on and off; align logo start,
  center, end; verify contact text and icon colors independently.
- Presets and archive layouts: verify visible change; open/close offcanvas
  filters on desktop/mobile, filter products, reload.
- Arabic RTL / English LTR; no horizontal overflow; keyboard navigation.
- Check storefront console/network for errors, including product requests.

## Remaining limitations

- No authenticated Salla editor/storefront test was completed in this review.
- Sass import deprecations and webpack bundle-size warnings are non-blocking
  maintenance/performance work; do not represent a clean marketplace audit.
- Verify author/support contact metadata before marketplace submission. The
  GitHub noreply address is not a customer support inbox.
- This archive is a source snapshot, not a promise that Salla accepts ZIP upload;
  use the linked repository/preview workflow configured for your theme.

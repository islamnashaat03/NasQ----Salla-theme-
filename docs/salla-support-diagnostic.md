# NASQ demo synchronization failure — 2026-10-03

Please investigate the development preview synchronization for this theme. Partners displays the correct schema, but new draft editors do not expose the custom components, and the official CLI cannot upload the homepage template.

- Theme: NASQ, ID 1850944111, Twig, development.
- Demo: nasq-demo-new, store ID 1592857134.
- Repository: https://github.com/islamnashaat03/NasQ----Salla-theme-
- Selected branch: codex/nasq-builder-test.
- Source commit: bc1f037.
- Latest portal draft: 1053532842.
- Latest CLI draft: 143704491.
- Official CLI version: 3.2.56; Windows; Node 22.19.0.
- Partners shows 3 custom components and 55 local settings. Hero 100 path: home.nasq-hero-100.
- Local contract validation, production asset build, webpack watcher and assets/websocket servers succeed.
- `salla theme sync` for src/views/pages/index.twig returns HTTP 417, error code `error`, message `حصل خطأ غير متوقع!`.
- The CLI exits with code 0 despite that error. Relative and absolute file paths both failed in previous checks.
- Git tracks the exact homepage path and all supporting templates.
- Fresh draft editor says there are no customizable homepage components. Its storefront preview is blank in today's check.

Please check draft initialization, repository file import and the upload endpoint response for these IDs. The internal cause has not been established. This report intentionally excludes account credentials and signed preview URLs.

Reproduction: run the official theme preview command from the linked project root with `--store nasq-demo-new --with-editor --browser chrome`, then synchronize the homepage into that returned draft using the CLI watcher.

Documentation reviewed: https://docs.salla.dev/422776m0.

# Validation-first workflow

For every Salla-facing change:

1. Read the current official Salla documentation for the affected page, component, hook, SDK API, or schema.
2. Register affected files, official URLs, review date, and checks in `salla-validation.json`.
3. Implement the smallest change.
4. Run `npm run production`; do not commit or upload on failure.
5. Preview on a Salla demo store before marking the feature complete.

The gate rejects undocumented Twig files, missing component templates, hard-coded Arabic UI text, and unsafe `|raw` output.


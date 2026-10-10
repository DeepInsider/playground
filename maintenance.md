# Development dependency maintenance

Validated baseline: Node.js 24.21.0 LTS, npm 11.19.0 (2026-10-10).
Use `.nvmrc` with your Node version manager; this repository does not install or replace system Node.

## Scope

The first maintenance pass updates development tools and their compatible transitive dependencies.
D3 3.5.17, Material Design Lite 1.3.0, seedrandom 2.4.4 and TypeScript 2.9.2 remain unchanged.
Browserify is declared directly instead of relying on another package to install its CLI.
JavaScript compilation and compression run sequentially so compilation failures stop the build.
Native Node watchers replace watchify and also watch HTML and CSS (the previous concat commands only copied once).
Local servers bind to 127.0.0.1. `npm run clean` removes generated files and preserves documentation/images.

## Validation before deployment

1. `npm ci --ignore-scripts`
2. `npm run build`
3. `npm audit` and `npm audit --omit=dev`
4. Verify source changes rebuild JavaScript, HTML and CSS under `npm run serve-watch`.
5. Compare fixed-seed data and learning outputs with the previous build, and check representative activation, loss, regularization, batch, dataset, network and display controls.
6. Check generated-file diffs and publish `master/docs` only after review; confirm the Pages build and live page.

## Verified in this pass

- Clean `npm ci --ignore-scripts` and full build on Node 24.21.0 / npm 11.19.0.
- JavaScript, HTML and CSS rebuild after file edits; invalid TypeScript produces a failed compilation.
- All 30 representative browser cases passed, including learning and display controls.
- Fixed-seed training loss display matched the previous build at each of 10 steps.
- Thumbnail opacity was 0.4 normally and 1 on hover/selection; selection and stepping worked without uncaught JavaScript exceptions.
- D3/MDL/seedrandom/TypeScript versions are unchanged; old fsevents is absent from the new lockfile.

## Remaining work

The initial audit was 35 affected packages (9 critical, 18 high, 7 moderate, 1 low).
After this pass the audit is 4 low-severity development packages, with no moderate/high/critical findings and no production findings.
The remaining chain is Browserify's crypto-browserify / browserify-sign / create-ecdh / elliptic.
These modules are not in this application's Browserify output (which imports D3 and local sources).
Counts are a 2026-10-10 snapshot, not a permanent guarantee.
Do not use `npm audit fix --force`: even the compatible automated fix tried resolving an older crypto-browserify with new critical findings during this pass; newer compatible versions were restored and re-audited.

D3 has breaking API changes after v3. MDL is in limited support. TypeScript modernization and any bundler replacement need a separate migration and browser regression checks.
Seedrandom can be considered separately, retaining fixed-seed reproducibility and checking how its global API is loaded.

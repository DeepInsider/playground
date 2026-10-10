# Development dependency maintenance

Validated baseline: Node.js 24.21.0 LTS, npm 11.19.0 (2026-10-10).
Use `.nvmrc` with your Node version manager; this repository does not install or replace system Node.

## Scope

The first maintenance pass updates development tools and their compatible transitive dependencies.
D3 3.5.17 and Material Design Lite 1.3.0 remain unchanged.
The first pass retained TypeScript 2.9.2; the second pass updates it to 5.9.3.
The third pass updates seedrandom from 2.4.4 to 3.0.5.
Browserify is declared directly instead of relying on another package to install its CLI.
JavaScript compilation and compression run sequentially so compilation failures stop the build.
Native Node watchers replace watchify and also watch HTML and CSS (the previous concat commands only copied once).
Local servers bind to 127.0.0.1. `npm run clean` removes generated files and preserves documentation/images.

## Validation before deployment

1. `npm ci --ignore-scripts`
2. `npm run build`
   Also run `npm run typecheck` for the standalone compiler check.
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
- D3/MDL/seedrandom versions are unchanged; old fsevents is absent from the new lockfile.

## TypeScript update

TypeScript 5.9.3 is pinned and type-checking is available with `npm run typecheck`.
Clean installation, standalone type checking, full build, all 30 browser cases, hover checks and change/error detection passed on Node 24.21.0. The fixed-seed loss display matched the TypeScript 2.9 build at all 10 checked steps. Audit results remain 4 low development findings and 0 production findings.
The compiler still emits ES5/CommonJS for Browserify; no application source or learning algorithm changes are needed.
`include` limits compilation to `src/**/*.ts`. `types: []` prevents ambient type packages from being loaded automatically; D3 declarations still resolve through source imports, and the local seedrandom declaration is included.
This also prevents duplicate implicit D3 type entries whose path casing differs in tsify on Windows. Type checking and casing consistency are not disabled.
TypeScript 6 deprecates the ES5 target and legacy Node module resolution; TypeScript 7 uses a native compiler distribution with no traditional `main` entry for the current tsify integration. Those migrations are deferred to the separate bundler/output-target review.

## Seedrandom update

Seedrandom 3.0.5 is pinned. Its minified browser script is still included in `docs/lib.js`; the application continues to call `Math.seedrandom(seed)` and use `Math.random()` for simulation.
Version 3 no longer installs `Math.seedrandom` when loaded through CommonJS `require`, so any future bundler migration must preserve browser-script loading or explicitly adapt the API. See the [upstream usage notes](https://github.com/davidbau/seedrandom#cjs--nodejs-usage).
Six string seeds (including an empty string and Japanese text), with 1,000 random values each, matched version 2.4.4 exactly in browser-script mode. Fixed-seed learning loss matched the baseline at all 10 checked steps. Type checking, full build, all 30 browser cases and hover checks passed; clean installation and audit retain 4 low development findings and 0 production findings.
No application source, dataset generation or learning algorithm changes are needed.

## Bundler replacement

Browserify, tsify and uglify-js are replaced by esbuild 0.28.2 and `scripts/build-js.cjs`. TypeScript still checks the entire project and emits ES5/CommonJS with `--noEmitOnError`; esbuild bundles that JavaScript with `target: es5`. This avoids esbuild's limitation on lowering ES6 syntax to ES5. See the [esbuild ES5 notes](https://esbuild.github.io/content-types/#es5).
Each build uses a unique ignored `.build/js-*` directory and removes it afterward. Debug builds include inline source maps with TypeScript sources; production builds are minified. Native source watching invokes the same build script, so type failures retain the previous bundle and wait for corrected edits.
D3 v3's non-strict global initialization cannot run inside the strict bundle. The build resolves D3 imports to `window.d3`, already provided by `lib.js`; HTML must keep loading `lib.js` first. This also removes a duplicate D3 copy from the bundle. Seedrandom and MDL retain their existing script loading.
The Browserify crypto dependency chain (including elliptic) is removed from the lockfile. Clean installation with `--ignore-scripts` works with esbuild's platform optional package; do not omit optional dependencies.
Validation on Node 24.21.0: clean installation, standalone type checking, production build, all 30 Chrome browser cases, hover controls and JS/CSS/HTML change watching passed. The fixed-seed loss display matches the prior build at all 10 checked steps. Both syntax and semantic type errors stop compilation; a semantic failure preserves the previous bundle and cleans temporary files. Audit reports 0 development and 0 production findings. ES5 output is retained by the compiler and bundler settings; historical browsers were not directly tested.

## Remaining work

The initial audit was 35 affected packages (9 critical, 18 high, 7 moderate, 1 low).
The first three passes retained 4 low-severity development packages, with no moderate/high/critical findings and no production findings.
Their chain was Browserify's crypto-browserify / browserify-sign / create-ecdh / elliptic.
The bundler replacement removes that chain; its audit reports 0 vulnerabilities including development dependencies.
Counts are a 2026-10-10 snapshot, not a permanent guarantee.
Do not use `npm audit fix --force`: even the compatible automated fix tried resolving an older crypto-browserify with new critical findings during this pass; newer compatible versions were restored and re-audited.

D3 has breaking API changes after v3. MDL is in limited support. Further compiler upgrades and changes to the ES5 output target need a separate migration and browser regression checks.
Keep fixed-seed reproducibility and seedrandom's browser global API in regression checks during any bundler migration.

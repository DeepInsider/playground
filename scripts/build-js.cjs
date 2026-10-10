// Keep TypeScript's ES5 output and type checking before bundling.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
async function main() {
  const buildRoot = path.join(root, '.build');
  fs.mkdirSync(buildRoot, { recursive: true });
  const temporary = fs.mkdtempSync(path.join(buildRoot, 'js-'));
  try {
    const compiled = spawnSync(process.execPath, [
      require.resolve('typescript/bin/tsc'), '--project', path.join(root, 'tsconfig.json'),
      '--outDir', temporary, '--noEmitOnError', '--sourceMap', '--inlineSources'
    ], { cwd: root, stdio: 'inherit' });
    if (compiled.error) throw compiled.error;
    if (compiled.status !== 0) {
      process.exitCode = compiled.status || 1;
    } else {
      const debug = process.argv.includes('--debug');
      await esbuild.build({
        entryPoints: [path.join(temporary, 'playground.js')],
        outfile: path.join(root, 'docs/bundle.js'),
        bundle: true,
        platform: 'browser',
        format: 'iife',
        target: 'es5',
        minify: !debug,
        sourcemap: debug ? 'inline' : false,
        plugins: [{
          name: 'browser-d3',
          setup(build) {
            // D3 v3 expects non-strict top-level `this`. lib.js already loads it.
            build.onResolve({ filter: /^d3$/ }, () => ({ path: 'd3', namespace: 'browser-d3' }));
            build.onLoad({ filter: /.*/, namespace: 'browser-d3' }, () => ({
              contents: 'module.exports = window.d3;', loader: 'js'
            }));
          }
        }],
        logLevel: 'info'
      });
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    // Only remove the unique directory created by this invocation.
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

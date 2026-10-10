// Rebuild on source changes using Node's built-in watcher.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
let child;
let pending = false;
let timer;
let stopping = false;

function rebuild() {
  if (stopping) return;
  if (child) {
    pending = true;
    return;
  }
  child = spawn(process.execPath, [
    path.join(root, 'scripts/build-js.cjs'), '--debug'
  ], { cwd: root, stdio: 'inherit' });
  child.on('error', error => console.error(error));
  child.on('close', code => {
    child = undefined;
    if (code !== 0 && !stopping) console.error(`JavaScript build failed (${code}); waiting for edits.`);
    if (pending) {
      pending = false;
      rebuild();
    }
  });
}

const watcher = fs.watch(path.join(root, 'src'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 150);
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopping = true;
    clearTimeout(timer);
    watcher.close();
    if (child) child.kill();
  });
}
rebuild();

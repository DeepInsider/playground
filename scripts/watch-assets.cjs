const fs = require('node:fs');
const path = require('node:path');
const concat = require('concat');
const root = path.resolve(__dirname, '..');
const kind = process.argv[2];
if (!['css', 'html'].includes(kind)) throw new Error('Expected css or html');
const source = kind === 'css' ? 'styles.css' : 'index.html';
let chain = Promise.resolve();
function rebuild() {
  chain = chain.then(async () => {
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    if (kind === 'html') {
      fs.copyFileSync(path.join(root, source), path.join(root, 'docs/index.html'));
    } else {
      await concat([path.join(root, 'node_modules/material-design-lite/material.min.css'), path.join(root, source)], path.join(root, 'docs/bundle.css'));
      fs.copyFileSync(path.join(root, 'node_modules/material-design-lite/material.min.css.map'), path.join(root, 'docs/material.min.css.map'));
    }
  }).catch(error => console.error(error));
}
const watcher = fs.watch(root, (_, filename) => {
  if (filename === source) rebuild();
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => watcher.close());
rebuild();

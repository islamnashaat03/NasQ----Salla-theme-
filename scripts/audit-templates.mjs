import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const name = path.join(directory, entry.name);
  return entry.isDirectory() ? files(name) : [name];
});
const twigFiles = files('src/views').filter(file => file.endsWith('.twig'));
const paired = new Set(['if', 'for', 'block', 'macro', 'autoescape', 'embed', 'filter', 'apply', 'with', 'spaceless', 'sandbox', 'verbatim']);
for (const file of twigFiles) {
  const source = fs.readFileSync(file, 'utf8').replace(/{#[\s\S]*?#}/g, '');
  const stack = [];
  for (const match of source.matchAll(/{%-?\s*([\s\S]*?)\s*-?%}/g)) {
    const expression = match[1].trim();
    const tag = expression.match(/^\w+/)?.[0] ?? '';
    if (paired.has(tag) || (tag === 'set' && !expression.includes('='))) stack.push(tag);
    else if (tag.startsWith('end')) assert.equal(stack.pop(), tag.slice(3), `${file}: mismatched ${tag}`);
  }
  assert.equal(stack.length, 0, `${file}: unclosed Twig blocks: ${stack}`);
}
const jsFiles = files('src/assets/js').filter(file => file.endsWith('.js'));
for (const file of jsFiles) {
  execFileSync(process.execPath, ['--input-type=module', '--check'], { input: fs.readFileSync(file), stdio: ['pipe', 'pipe', 'pipe'] });
}
const read = file => fs.readFileSync(file, 'utf8');
assert.match(read('src/views/components/home/visual-cards.twig'), /nasq.choice/);
assert.match(read('src/views/components/footer/footer.twig'), /nasq.choice/);
assert.doesNotMatch(read('src/assets/styles/04-components/nasq-fashion.scss'), /content-visibility:\s*auto/);
assert.doesNotMatch(read('src/assets/styles/04-components/footer.scss'), /@apply bg-gray-50 text-gray-700/);
for (const file of ['nasq-products-grid', 'nasq-products-slider', 'shop-the-look', 'slider-products-with-header']) {
  assert.match(read(`src/views/components/home/${file}.twig`), /json_encode\|e\('html_attr'\)/);
}
console.log(`Static audit passed: ${twigFiles.length} Twig block structures, ${jsFiles.length} JS syntax checks and regression guards. Not a Salla Twig render test.`);

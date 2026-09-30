import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory)) {
    const full = path.posix.join(directory, entry);
    (await stat(full)).isDirectory() ? files.push(...await walk(full)) : files.push(full);
  }
  return files;
}

const registry = JSON.parse(await readFile('docs/salla-validation.json', 'utf8'));
const twigFiles = (await walk('src/views')).filter((file) => file.endsWith('.twig'));
const governedFiles = [...await walk('src'), 'twilight.json', 'package.json'];
const registered = new Set(registry.artifacts.flatMap((item) => item.files));
const undocumented = governedFiles.filter((file) => !registered.has(file));
if (undocumented.length) throw new Error(`Salla review evidence missing for: ${undocumented.join(', ')}`);
const invalidEvidence = registry.artifacts.filter((item) => !item.reviewed_on || !item.sources?.every((url) => url.startsWith('https://docs.salla.dev/')));
if (invalidEvidence.length) throw new Error(`Invalid Salla review record: ${invalidEvidence.map((item) => item.id).join(', ')}`);

for (const file of twigFiles) {
  const source = await readFile(file, 'utf8');
  if (/[؀-ۿ]{2,}/u.test(source)) throw new Error(`Hard-coded Arabic text must use localization: ${file}`);
  if (source.includes('|raw')) throw new Error(`Unsafe raw filter found in ${file}`);
}

const config = JSON.parse(await readFile('twilight.json', 'utf8'));
for (const component of config.components) {
  const file = `src/views/components/${component.path.replaceAll('.', '/')}.twig`;
  if (!twigFiles.includes(file)) throw new Error(`Component template missing: ${file}`);
}
const packageConfig = JSON.parse(await readFile('package.json', 'utf8'));
if (packageConfig.devDependencies?.['@salla.sa/twilight'] !== '2.14.583') throw new Error('Twilight must match the reviewed Salla release baseline.');
console.log(`Salla contract gate passed: ${registry.artifacts.length} reviewed artifacts.`);

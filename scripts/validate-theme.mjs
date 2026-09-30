import { access, readFile, stat } from 'node:fs/promises';

const required = [
  'twilight.json',
  'src/views/layouts/master.twig',
  'src/views/pages/index.twig',
  'src/views/components/header/header.twig',
  'src/views/components/footer/footer.twig',
  'src/locales/ar.json',
  'src/locales/en.json'
];

await Promise.all(required.map((file) => access(file)));
const config = JSON.parse(await readFile('twilight.json', 'utf8'));
const builtInHomeFeatures = config.features.filter((feature) => feature.startsWith('component-'));
if (builtInHomeFeatures.length) throw new Error(`Built-in home components must stay disabled during construction: ${builtInHomeFeatures.join(', ')}`);
const ids = config.settings.map((setting) => setting.id).filter(Boolean);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error(`Duplicate setting ids: ${duplicates.join(', ')}`);
if (!config.name?.ar || !config.name?.en) throw new Error('Theme name must be bilingual.');
const hero = config.components.find((component) => component.name === 'nasq-hero-100');
if (!hero) throw new Error('Hero 100 component is required.');
for (const id of ['height', 'mobile_height', 'background_type', 'title', 'buttons']) {
  if (!hero.fields.some((field) => field.id === id)) throw new Error(`Hero 100 field missing: ${id}`);
}
const backgroundTypes = hero.fields.find((field) => field.id === 'background_type').options.map((option) => option.value);
for (const mode of ['image', 'video', 'image-slider', 'video-slider']) {
  if (!backgroundTypes.includes(mode)) throw new Error(`Hero 100 background mode missing: ${mode}`);
}
for (const component of config.components) {
  const fieldIds = component.fields.map((field) => field.id);
  if (new Set(fieldIds).size !== fieldIds.length) throw new Error(`Duplicate fields in component: ${component.name}`);
  for (const field of component.fields.filter((item) => item.type === 'collection')) {
    if (!field.maxLength || field.maxLength > 10) throw new Error(`Collection ${component.name}.${field.id} must have maxLength <= 10.`);
  }
}
const publicSize = (await stat('public/app.css')).size + (await stat('public/app.js')).size;
if (publicSize > 1024 * 1024) throw new Error('Built theme assets exceed Salla 1 MB review limit.');
console.log(`NASQ validated: ${ids.length} settings, ${config.components.length} components.`);

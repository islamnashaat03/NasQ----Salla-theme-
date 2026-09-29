import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const configPath = path.join(root, 'twilight.json');
const errors = [];

let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error(`twilight.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

const duplicateValues = (items) => {
  const seen = new Set();
  return items.filter((item) => seen.has(item) || !seen.add(item));
};

const validateField = (field, location) => {
  if (!field.id) errors.push(`${location}: field is missing id`);
  if (!field.type) errors.push(`${location}.${field.id ?? '?'}: field is missing type`);

  if (field.format === 'icons') {
    errors.push(`${location}.${field.id}: use format \"icon\" (singular), not \"icons\"`);
  }

  if (field.format === 'dropdown-list') {
    if (!field.source) errors.push(`${location}.${field.id}: dropdown-list is missing source`);

    if (field.source === 'Manual') {
      if (field.multichoice !== false) errors.push(`${location}.${field.id}: single-select must explicitly disable multichoice`);
      if (!Array.isArray(field.value)) errors.push(`${location}.${field.id}: manual dropdown must initialize value`);
      for (const selected of field.selected ?? []) {
        if (!(field.options ?? []).some(option => option.key === selected.key && option.value === selected.value)) {
          errors.push(`${location}.${field.id}: selected default does not match an option`);
        }
      }
      if (!Array.isArray(field.options) || !field.options.length) {
        errors.push(`${location}.${field.id}: manual dropdown requires options`);
      } else {
        field.options.forEach((option, index) => {
          if (!option.key) errors.push(`${location}.${field.id}.options[${index}]: option is missing key`);
          if (option.value === undefined) errors.push(`${location}.${field.id}.options[${index}]: option is missing value`);
        });
      }
      if (field.required && (!Array.isArray(field.selected) || !field.selected.length)) {
        errors.push(`${location}.${field.id}: required manual dropdown needs a selected default`);
      }
    }

    if (field.source === 'products') {
      for (const key of ['selected', 'options', 'value']) {
        if (!Array.isArray(field[key])) errors.push(`${location}.${field.id}: products dropdown ${key} must be an array`);
      }
      if (field.multichoice !== true) errors.push(`${location}.${field.id}: products dropdown must enable multichoice`);
      if (field.searchable !== true) errors.push(`${location}.${field.id}: products dropdown must enable searchable`);
      if (!Number.isInteger(field.minLength) || !Number.isInteger(field.maxLength)) {
        errors.push(`${location}.${field.id}: products dropdown requires integer minLength/maxLength`);
      }
    }
  }

  if (field.type === 'collection') {
    if (!Array.isArray(field.fields) || !field.fields.length) {
      errors.push(`${location}.${field.id}: collection requires child fields`);
    } else {
      field.fields.forEach((child, index) => validateField(child, `${location}.${field.id}[${index}]`));
    }
    if (!Number.isInteger(field.minLength) || !Number.isInteger(field.maxLength)) {
      errors.push(`${location}.${field.id}: collection requires integer minLength/maxLength`);
    }
  }
};

const settingIds = (config.settings ?? []).map((setting) => setting.id).filter(Boolean);
for (const duplicate of duplicateValues(settingIds)) errors.push(`settings: duplicate id ${duplicate}`);
(config.settings ?? []).forEach((field, index) => validateField(field, `settings[${index}]`));

const componentKeys = (config.components ?? []).map((component) => component.key).filter(Boolean);
for (const duplicate of duplicateValues(componentKeys)) errors.push(`components: duplicate key ${duplicate}`);

if (!config.repository || config.repository.includes('example.com')) {
  errors.push('theme repository must point to the real source repository');
}
if (!config.support_url || config.support_url.includes('example.com')) {
  errors.push('support_url must point to a real support channel');
}
if (!config.author_email || config.author_email.endsWith('@example.com')) {
  errors.push('author_email must not use the example.com placeholder');
}

(config.components ?? []).forEach((component, index) => {
  const location = `components[${index}](${component.path ?? '?'})`;
  if (!component.key) errors.push(`${location}: component is missing key`);
  if (!component.path) errors.push(`${location}: component is missing path`);
  if (!component.title?.ar || !component.title?.en) errors.push(`${location}: component needs Arabic and English titles`);

  if (component.path) {
    const twigPath = path.join(root, 'src', 'views', 'components', `${component.path.replaceAll('.', path.sep)}.twig`);
    if (!fs.existsSync(twigPath)) errors.push(`${location}: missing Twig file ${path.relative(root, twigPath)}`);
  }

  (component.fields ?? []).forEach((field, fieldIndex) => validateField(field, `${location}.fields[${fieldIndex}]`));
  for (const duplicate of duplicateValues((component.fields ?? []).map(field => field.id))) {
    errors.push(`${location}: duplicate field id ${duplicate}`);
  }
});

const customTwigFiles = fs.readdirSync(path.join(root, 'src', 'views', 'components', 'home'))
  .filter((file) => file.endsWith('.twig'));
for (const file of customTwigFiles) {
  const source = fs.readFileSync(path.join(root, 'src', 'views', 'components', 'home', file), 'utf8');
  if (/source=["']selected["'][^>]*source-value=["'][^"']*join\(/s.test(source)) {
    errors.push(`src/views/components/home/${file}: selected product IDs must be JSON encoded, not comma-joined`);
  }
}

if (errors.length) {
  console.error(`Theme validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Theme validation passed: ${config.settings.length} settings, ${config.components.length} custom components.`);

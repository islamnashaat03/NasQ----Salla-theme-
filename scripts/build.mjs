import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('public', { recursive: true });
await Promise.all([
  copyFile('src/assets/styles/app.css', 'public/app.css'),
  copyFile('src/assets/js/app.js', 'public/app.js')
]);
console.log('NASQ assets built in public/');


import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const readJson = name => JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
export const config = readJson('site.config.json');
export const catalog = readJson('catalog.json');
export const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function inside(relative) {
  const full = path.resolve(root,relative);
  if (!full.startsWith(root+path.sep)) throw new Error('Ruta fuera del repositorio: '+relative);
  return full;
}
export const published = () => catalog.animations.filter(a=>a.published);
export const route = a => `${a.topic}/${a.id}/`;

import fs from 'node:fs';
import vm from 'node:vm';
import {config,catalog,inside,published,route} from './lib.mjs';
function requireCondition(condition,message){if(!condition)throw new Error(message);}
requireCondition(/^\/[a-z0-9/-]*\/$/.test(config.basePath),'basePath debe comenzar y terminar con / y usar una ruta sencilla.');
const slug=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const topics=new Set();
for(const t of catalog.topics){requireCondition(slug.test(t.id)&&!topics.has(t.id),'Tema inválido o repetido: '+t.id);topics.add(t.id);requireCondition(t.title&&t.description,'Tema incompleto: '+t.id);}
const routes=new Set();
for(const a of catalog.animations){
 requireCondition(slug.test(a.id)&&topics.has(a.topic),'Identificador o tema inválido: '+a.id);
 requireCondition(!routes.has(route(a)),'Dirección repetida: '+route(a));routes.add(route(a));
 requireCondition(a.title&&a.description&&Array.isArray(a.concepts)&&Array.isArray(a.units)&&a.units.every(n=>Number.isInteger(n)&&n>0),'Ficha incompleta: '+a.id);
 requireCondition(typeof a.published==='boolean','published debe ser true o false: '+a.id);
 const source=inside(a.source);requireCondition(fs.existsSync(source),'Falta el archivo: '+a.source);
 const html=fs.readFileSync(source,'utf8');
 requireCondition(/<html\b[^>]*lang=["']es["']/.test(html)&&/<title>[^<]+<\/title>/.test(html),'Falta idioma o título: '+a.id);
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(/\bsrc\s*=|application\/(?:ld\+)?json|\btype\s*=\s*["']module/.test(match[1]))continue;
  new vm.Script(match[2],{filename:a.source});
 }
 if(a.published)requireCondition(!/\{\{[A-Z_]+\}\}|TODO_ANIMATION/.test(html),'Borrador incompleto marcado como publicado: '+a.id);
}
console.log(`Validación correcta: ${published().length} animaciones publicables; ${catalog.animations.length-published().length} borradores.`);

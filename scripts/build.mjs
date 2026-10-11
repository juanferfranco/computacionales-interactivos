import fs from 'node:fs';
import path from 'node:path';
import {root,config,catalog,published,route,escapeHtml as e,inside} from './lib.mjs';
const dist=path.resolve(root,'dist');
if(dist!==path.join(root,'dist'))throw new Error('Destino inesperado');
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
fs.cpSync(path.join(root,'site/assets'),path.join(dist,'assets'),{recursive:true});
const animations=published();
const sections=catalog.topics.filter(t=>animations.some(a=>a.topic===t.id)).map(t=>{
 const rows=animations.filter(a=>a.topic===t.id).map((a,i)=>`<article class="resource"><span class="resource-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><h3><a href="${route(a)}">${e(a.title)}</a></h3><p>${e(a.description)}</p><ul class="concepts" aria-label="Conceptos">${a.concepts.map(c=>`<li>${e(c)}</li>`).join('')}</ul></div><a class="open-resource" href="${route(a)}" aria-label="Abrir ${e(a.title)}">Abrir <span aria-hidden="true">↗</span></a></article>`).join('\n');
 return `<section class="topic" id="${t.id}"><div class="topic-heading"><p class="eyebrow">Tema</p><h2>${e(t.title)}</h2><p>${e(t.description)}</p></div><div class="resources">${rows}</div></section>`;
}).join('\n');
let index=fs.readFileSync(path.join(root,'site/index.html'),'utf8').replaceAll('{{TITLE}}',e(config.title)).replaceAll('{{DESCRIPTION}}',e(config.description)).replace('{{CATALOG}}',sections);
fs.writeFileSync(path.join(dist,'index.html'),index);
for(const a of animations){
 const source=inside(a.source),target=path.join(dist,route(a));fs.mkdirSync(target,{recursive:true});
 // Copy the entire animation directory so future images, scripts and styles travel with it.
 fs.cpSync(path.dirname(source),target,{recursive:true});
 let html=fs.readFileSync(source,'utf8');
 const prefix='../'.repeat(route(a).split('/').filter(Boolean).length);
 html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/animation.css">\n<script src="${prefix}assets/theme.js" defer></script>\n</head>`);
 const nav=`<nav class="collection-nav" aria-label="Colección de animaciones"><a class="collection-brand" href="${prefix}">Sistemas computacionales <span> / Interactivos</span></a><div><a href="${prefix}#${a.topic}">Catálogo</a><button type="button" data-theme-toggle aria-label="Cambiar tema">Tema claro</button></div></nav>`;
 html=html.replace(/<body\b[^>]*>/i,match=>match+'\n'+nav);
 fs.writeFileSync(path.join(target,'index.html'),html);
}
fs.writeFileSync(path.join(dist,'.nojekyll'),'');
fs.writeFileSync(path.join(dist,'404.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página no encontrada</title><link rel="stylesheet" href="${config.basePath}assets/site.css"><body><main class="container"><h1>Página no encontrada</h1><p>Busca la animación en el catálogo.</p><a href="${config.basePath}">Volver al catálogo</a></main></body></html>`);
console.log(`Sitio construido en dist/: ${animations.length} animaciones. Base de publicación: ${config.basePath}`);

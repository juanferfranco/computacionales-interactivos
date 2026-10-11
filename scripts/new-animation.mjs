import fs from 'node:fs';
import path from 'node:path';
import {root,catalog,escapeHtml as e} from './lib.mjs';
const args=process.argv.slice(2);
if(!args.length||args.includes('--help')){
 console.log('npm run new:animation -- --id hilos --topic concurrencia --title "Procesos e hilos" --unit 8\nCrea un borrador: no se publica hasta completar el contenido y cambiar published a true.');process.exit(0);
}
const values={};
for(let i=0;i<args.length;i+=2){if(!['--id','--topic','--title','--unit'].includes(args[i])||!args[i+1])throw new Error('Argumentos inválidos. Consulta --help.');values[args[i].slice(2)]=args[i+1];}
const {id,topic,title,unit}=values;
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id||'')||!catalog.topics.some(t=>t.id===topic)||!title||!Number.isInteger(Number(unit))||Number(unit)<1)throw new Error('Indica un id válido, tema existente, título y unidad positiva.');
const source=`src/animations/${topic}/${id}/index.html`,destination=path.join(root,source);
if(fs.existsSync(path.dirname(destination))||catalog.animations.some(a=>a.topic===topic&&a.id===id))throw new Error('Ya existe esa animación. No se sobrescribió ningún archivo.');
const html=fs.readFileSync(path.join(root,'templates/animation.html'),'utf8').replaceAll('{{TITLE}}',e(title));
fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,html);
catalog.animations.push({id,topic,title,description:'Completar la descripción del concepto.',source,units:[Number(unit)],published:false,concepts:[]});
fs.writeFileSync(path.join(root,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Borrador creado: ${source}\nEdita el contenido y catalog.json. Cambia published a true cuando esté listo.`);

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {root,config} from './lib.mjs';
const dist=path.join(root,'dist');
if(!fs.existsSync(path.join(dist,'index.html')))throw new Error('Primero ejecuta npm run build.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(url==='/'){res.writeHead(302,{Location:config.basePath});res.end();return;}
  if(!url.startsWith(config.basePath)){res.writeHead(404);res.end('Página no encontrada');return;}
  url=url.slice(config.basePath.length);
  let file=path.resolve(dist,url);
  if(file!==dist&&!file.startsWith(dist+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){
   if(!req.url.split('?')[0].endsWith('/')){res.writeHead(302,{Location:new URL(req.url,'http://localhost').pathname+'/'});res.end();return;}
   file=path.join(file,'index.html');
  }
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync(path.join(dist,'404.html')));return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Petición inválida');}
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${config.basePath}\nPulsa Ctrl+C para cerrar.`));

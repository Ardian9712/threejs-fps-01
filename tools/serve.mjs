import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../game');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'};
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(root+sep))throw Error('outside root');const bytes=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT||8080),'127.0.0.1',()=>console.log('QUARRYLINE server ready'));

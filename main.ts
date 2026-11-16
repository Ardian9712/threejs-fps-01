import {cpSync,mkdirSync,writeFileSync,rmSync,existsSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDossier} from './vendor/makefun-threejs.ts';
const root=dirname(fileURLToPath(import.meta.url));
const output=resolve(process.env.MAKEFUN_OUTPUT_DIR||(existsSync('/output')?'/output':'./out'));
if(output===root||output===join(root,'game')||output===join(root,'screenshots'))throw new Error('Output must be a separate directory');
mkdirSync(output,{recursive:true});
for(const part of ['game','screenshots']){rmSync(join(output,part),{recursive:true,force:true});cpSync(join(root,part),join(output,part),{recursive:true});}
writeFileSync(join(output,'dossier.json'),buildDossier(output,{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648,game_path_max_bytes:1000}));

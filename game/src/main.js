import * as T from 'three';
import {createState} from './core.js';
import {createWorld} from './world.js';
import {createInput} from './input.js';
import {createAudio} from './audio.js';
import {updatePlayer} from './player.js';
import {updateGun} from './weapons.js';
import {makeBots,updateBots,renderBots} from './bots.js';
import {startRound,updateRound,updateBomb} from './round.js';
import {setupShop} from './economy.js';
import {throwGrenade,updateGrenades} from './grenades.js';
import {createHUD} from './hud.js';
import {setupShot} from './shots.js';
const s=createState(),w=createWorld(s),audio=createAudio(),canvas=document.getElementById('view'),input=createInput(canvas,s,audio);
const renderer=new T.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const camera=new T.PerspectiveCamera(72,innerWidth/innerHeight,.05,180);camera.rotation.order='YXZ';w.scene.add(camera);
// A camera-space weapon keeps the hands and sights readable at every aspect ratio.
const viewGun=new T.Group(),geo=new T.BoxGeometry(1,1,1),steel=new T.MeshStandardMaterial({color:0x2e3b40,roughness:.45,metalness:.6}),rust=new T.MeshStandardMaterial({color:0xb0714d,roughness:.65}),glove=new T.MeshStandardMaterial({color:0x3c5e59});
function part(x,y,z,W,H,D,mat){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(W,H,D);viewGun.add(m);return m;}
part(.27,-.25,-.54,.13,.16,.52,steel);part(.27,-.24,-.88,.055,.055,.4,steel);part(.27,-.32,-.44,.1,.2,.12,rust);part(.27,-.34,-.63,.09,.22,.16,steel);part(.27,-.18,-.7,.08,.035,.27,rust);part(.27,-.15,-.67,.012,.06,.04,steel);part(.27,-.15,-.94,.012,.06,.025,steel);part(.3,-.36,-.4,.15,.12,.22,glove);part(.13,-.34,-.7,.16,.13,.19,glove);part(.36,-.43,-.23,.17,.17,.4,glove);part(.03,-.43,-.51,.17,.17,.4,glove);
const rifleParts=[...viewGun.children],models={rifle:rifleParts};
function model(key,color,parts){const group=new T.Group(),material=new T.MeshStandardMaterial({color,roughness:.45,metalness:.5});for(const [x,y,z,W,H,D,kind] of parts){const mesh=new T.Mesh(geo,kind===1?glove:kind===2?steel:material);mesh.position.set(x,y,z);mesh.scale.set(W,H,D);group.add(mesh);}viewGun.add(group);models[key]=[group];}
model('pistol',0xc4c9bd,[[.27,-.24,-.48,.11,.1,.29],[.27,-.33,-.38,.1,.18,.12,2],[.27,-.19,-.57,.025,.025,.025,2],[.29,-.37,-.35,.15,.13,.18,1],[.36,-.45,-.17,.17,.17,.4,1]]);
model('smg',0x648a83,[[.27,-.25,-.57,.15,.17,.39],[.27,-.25,-.83,.06,.06,.17,2],[.27,-.4,-.53,.085,.23,.11,2],[.27,-.3,-.31,.09,.1,.24,2],[.3,-.36,-.4,.15,.12,.22,1],[.15,-.34,-.64,.16,.13,.19,1],[.36,-.43,-.23,.17,.17,.4,1]]);
model('shotgun',0xc08a50,[[.27,-.23,-.68,.09,.09,.88,2],[.27,-.32,-.61,.13,.12,.5],[.27,-.29,-.37,.15,.17,.35,2],[.27,-.34,-.22,.12,.16,.3],[.3,-.37,-.35,.15,.12,.22,1],[.13,-.35,-.72,.16,.13,.19,1],[.36,-.43,-.23,.17,.17,.4,1]]);
const flash=new T.Mesh(new T.OctahedronGeometry(.13),new T.MeshBasicMaterial({color:0xffdc9c}));flash.position.set(.27,-.24,-1.12);flash.scale.set(.55,.65,1.5);viewGun.add(flash);camera.add(viewGun);const glow=new T.PointLight(0xffaa55,0,4);glow.position.copy(flash.position);viewGun.add(glow);
const charge=new T.Group();const chargeBody=new T.Mesh(new T.BoxGeometry(.45,.16,.32),steel);charge.add(chargeBody);const chargeLamp=new T.Mesh(new T.BoxGeometry(.13,.025,.12),new T.MeshBasicMaterial({color:0xff754c}));chargeLamp.position.y=.09;charge.add(chargeLamp);w.scene.add(charge);
makeBots(s,w);startRound(s);setupShop(s);setupShot(s,w);const hud=createHUD(s,w);
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);}addEventListener('resize',resize);resize();
function step(dt){s.time+=dt;s.tick++;if(s.phase==='match'&&input.pressed.has('Enter')){s.score=[0,0];s.loss=[0,0];s.round=1;for(const a of s.actors){a.money=800;a.kills=a.deaths=0;a.alive=false;}startRound(s);}if(input.pressed.has('KeyB')&&s.phase==='buy'){s.buy=!s.buy;if(s.buy)document.exitPointerLock();}if(input.pressed.has('KeyG'))throwGrenade(s,w,'frag');if(input.pressed.has('KeyQ'))throwGrenade(s,w,'smoke');for(const a of s.actors)updateGun(a,dt);updatePlayer(s,w,input,dt,audio);updateBots(s,w,dt,audio);updateGrenades(s,w,dt,audio);updateBomb(s,dt,input,audio);updateRound(s,dt,audio);s.hit=Math.max(0,s.hit-dt);s.hurt=Math.max(0,s.hurt-dt);for(const fx of s.fx)if(fx.active){fx.life-=dt;if(fx.life<=0){fx.active=false;fx.mesh.visible=false;}}input.pressed.clear();}
let previous=0,accumulator=0;
function frame(ms){const elapsed=Math.min(.1,(ms-previous)/1000||0);previous=ms;if(s.started&&!s.shot){accumulator+=elapsed;while(accumulator>=1/60){step(1/60);accumulator-=1/60;}}const p=s.player;camera.position.set(p.x,p.y,p.z);camera.rotation.set(p.pitch+p.recoil*.25,p.yaw,0);camera.fov=s.aim?53:72;camera.updateProjectionMatrix();for(const [key,parts] of Object.entries(models))for(const part of parts)part.visible=key===p.weapon;flash.position.z=p.weapon==='pistol'?-.65:p.weapon==='smg'?-.94:-1.12;glow.position.copy(flash.position);const bob=Math.sin(s.time*10)*Math.min(.012,Math.hypot(p.vx,p.vz)*.003);viewGun.position.set(s.aim?-.235:0,bob-p.recoil*.12,p.fire>0?.035:0);viewGun.rotation.x=p.reload>0?-.35:0;flash.visible=p.fire>0;glow.intensity=flash.visible?2:0;viewGun.visible=p.alive;charge.visible=s.phase==='live'&&(s.bomb.planted||s.bomb.carrier<0);charge.position.set(s.bomb.x,.12,s.bomb.z);chargeLamp.visible=!s.bomb.planted||Math.sin(s.time*12)>0;renderBots(s,w);hud(input);renderer.render(w.scene,camera);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Read-only inspection surface used by local play tests.
window.quarry={state:s,world:w,viewGun,models};

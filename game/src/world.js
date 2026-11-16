import * as T from 'three';
import {C,random} from './core.js';
export const sites=[{x:-20,z:-21,name:'A / CRUSHER'},{x:21,z:-20,name:'B / SILO'}];
export function createWorld(s){
 const scene=new T.Scene();scene.background=new T.Color(0xb7c4c4);scene.fog=new T.Fog(0xb7c4c4,38,115);
 scene.add(new T.HemisphereLight(0xe4f0e5,0x5c5550,2.5));const sun=new T.DirectionalLight(0xffdfb2,3.1);sun.position.set(-30,50,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:130});sun.shadow.bias=-0.0003;scene.add(sun);
 const solids=[],meshes=[],materials=new Map(),boxGeo=new T.BoxGeometry(1,1,1);
 function mat(c){if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.86}));return materials.get(c);}
 function box(x,y,z,w,h,d,c,solid=true){const m=new T.Mesh(boxGeo,mat(c));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;scene.add(m);if(solid){solids.push({x:x-w/2,X:x+w/2,z:z-d/2,Z:z+d/2,h:y+h/2});meshes.push(m);}return m;}
 function label(text,x,y,z,color='#e4d8b4',size=3.5){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const ctx=cv.getContext('2d');ctx.fillStyle='#23343b';ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='bold 65px Arial';ctx.textAlign='center';ctx.fillText(text,256,88);const tex=new T.CanvasTexture(cv);const m=new T.Mesh(new T.PlaneGeometry(size*4,size),new T.MeshBasicMaterial({map:tex}));m.position.set(x,y,z);scene.add(m);return m;}
 box(0,-.35,0,76,.7,82,0x9b9788,false);
 // Terraced quarry walls silhouette the playable bowl.
 for(let ring=0;ring<3;ring++){box(-40-ring*5,3+ring*3,0,7,8,100,ring%2?0x7e8179:0x8e9184);box(40+ring*5,3+ring*3,0,7,8,100,0x8e9184);box(0,3+ring*3,-44-ring*5,100,8,7,0x82877e);}
 box(0,3,40,80,6,3,0x707d78);box(-37,2,0,2,4,82,0x697b78);box(37,2,0,2,4,82,0x697b78);
 // Divider islands leave a long mid and two outside approaches.
 for(const x of [-11,11]){box(x,2.1,13,5,4.2,16,0x6f827f);box(x,2,-11,5,4,14,0x88928a);}
 function crate(x,z,w=3,h=2.3){box(x,h/2,z,w,h,3,C.rust);for(const off of [-.42,.42])box(x+off*w,h/2,z+.03,.12,h+.1,3.12,0x684b3a,false);}
 crate(-24,12,5);crate(25,9,5);crate(-4,-2);crate(5,-19,4);crate(-28,-15,3,3.1);crate(28,-26,4);crate(0,24,4);
 // Crusher gantry, belt and supporting machinery.
 for(const x of [-28,-14]){box(x,4,-29,.7,8,.7,0x414e50);box(x,4,-20,.7,8,.7,0x414e50);}box(-21,7.7,-25,15,1.1,12,C.rust,false);box(-21,5.2,-27,7,3.8,5,0x536663);box(-21,2,-28,4,4,4,0x313f43);box(-21,.12,-20,10,.24,5,0x485350,false);label('A  /  CRUSHER',-21,6.8,-18.7,'#ffcf99',1.2);
 // B landmark silos, with a passable ring around the site.
 for(const x of [20,28]){const m=new T.Mesh(new T.CylinderGeometry(3,3,10,20),mat(0xa0aba4));m.position.set(x,5,-32);m.castShadow=true;scene.add(m);solids.push({x:x-3,X:x+3,z:-35,Z:-29,h:10});meshes.push(m);box(x,6,-28.95,5,.35,.1,C.rust,false);}label('B  /  SILO',22,4,-28.7,'#a2e4d8',1.3);
 label('QUARRY / 07',0,5,38.3,'#cbded8',1.4).rotation.y=Math.PI;
 label('HAUL ROAD',0,3,-39,'#e4d8b4',1.5);
 for(const site of sites){box(site.x,.015,site.z,10,.03,9,site.x<0?0xa17d58:0x648e86,false);for(const dx of [-5,5])box(site.x+dx,.04,site.z,.12,.04,9,0xf2c17a,false);}
 for(let z=-36;z<35;z+=5)box(0,.025,z,.16,.04,2.4,0xd9c398,false);
 for(let i=0;i<55;i++){const x=(random(s)-.5)*70,z=(random(s)-.5)*76;box(x,.04,z,.12+random(s)*.2,.08,.2,0x777c72,false);}
 // Crane outside collision bounds gives the quarry a distinctive horizon.
 box(-33,11,-38,1.1,22,1.1,C.rust);box(-21,21,-38,26,1,1,C.rust);box(-10,16,-38,.08,10,.08,0x364346,false);
 const nodes=[[-29,31],[0,32],[29,31],[-28,18],[0,15],[28,18],[-28,1],[0,2],[28,0],[-28,-12],[0,-13],[28,-12],[-20,-21],[0,-36],[21,-20]] .map(([x,z],id)=>({x,z,id,links:[]}));
 const w={scene,solids,meshes,box,label,nodes};for(const a of nodes)for(const b of nodes)if(a!==b&&Math.hypot(a.x-b.x,a.z-b.z)<32&&walkable(w,a.x,a.z,b.x,b.z))a.links.push(b.id);return w;
}
export function blocked(w,x,z,r=.35){for(const b of w.solids)if(b.h>.6&&x+r>b.x&&x-r<b.X&&z+r>b.z&&z-r<b.Z)return true;return false;}
export function move(w,a,dx,dz){if(!blocked(w,a.x+dx,a.z))a.x+=dx;else a.vx=0;if(!blocked(w,a.x,a.z+dz))a.z+=dz;else a.vz=0;}
// Segment/slab test is also the visibility and bullet-cover query.
export function wallDistance(w,x,y,z,dx,dy,dz,max){let nearest=max;for(const b of w.solids){let lo=0,hi=nearest;for(let axis=0;axis<3;axis++){const p=axis===0?x:axis===1?y:z,d=axis===0?dx:axis===1?dy:dz,min=axis===0?b.x:axis===1?0:b.z,maxi=axis===0?b.X:axis===1?b.h:b.Z;if(Math.abs(d)<1e-8){if(p<min||p>maxi){hi=-1;break;}}else{let t=(min-p)/d,u=(maxi-p)/d;if(t>u){const v=t;t=u;u=v;}lo=Math.max(lo,t);hi=Math.min(hi,u);if(lo>hi)break;}}if(lo<=hi&&hi>=0)nearest=Math.min(nearest,lo);}return nearest;}
export function clear(w,x,y,z,X,Y,Z){const d=Math.hypot(X-x,Y-y,Z-z);if(d<.001)return true;return wallDistance(w,x,y,z,(X-x)/d,(Y-y)/d,(Z-z)/d,d)>=d-.05;}
export function walkable(w,x,z,X,Z){const length=Math.hypot(X-x,Z-z),steps=Math.ceil(length/.25);for(let i=0;i<=steps;i++){const t=steps?i/steps:0;if(blocked(w,x+(X-x)*t,z+(Z-z)*t,.48))return false;}return true;}

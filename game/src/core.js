// Team colors also identify equipment and objective architecture.
export const C={teal:0x5db9ac,rust:0xbf6745,dust:0xaaa391,dark:0x24343b};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function actor(id,team,x,z){return {id,team,name:id===0?'YOU':['','MICA','FLINT','SLATE','ROOK','ASH','IRON','DUNE','GRIT','FLUX'][id],x,z,y:1.65,vx:0,vz:0,yaw:0,pitch:0,hp:100,armor:0,alive:true,money:800,kills:0,deaths:0,weapon:'pistol',ammo:12,reserve:72,cool:0,reload:0,recoil:0,spread:0,fire:0,step:0,target:-1,think:0,reaction:0,path:[],node:0,goal:0,mesh:null,head:null};}
export function createState(){const s={seed:7619,time:0,tick:0,phase:'buy',timer:10,round:1,score:[0,0],loss:[0,0],buy:false,started:false,shot:'',winner:0,reason:'',actors:[],feed:[],noise:{x:0,z:0,team:-1,time:-99},bomb:{carrier:0,planted:false,x:0,z:0,timer:35,progress:0,user:-1,site:''},grenades:[],smokes:[],fx:[],hit:0,hurt:0,aim:false,crouch:false};for(let i=0;i<10;i++)s.actors.push(actor(i,i<5?0:1,0,0));s.player=s.actors[0];return s;}

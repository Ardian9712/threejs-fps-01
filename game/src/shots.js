import {equip,tracer} from './weapons.js';
// These scenes use the same actors, weapon geometry and HUD as live rounds.
export function setupShot(s,w){const shot=new URLSearchParams(location.search).get('shot');if(!['start','play','end'].includes(shot))return;s.seed=7619;s.shot=shot;s.started=true;s.tick=120;s.time=24;s.player.yaw=-.1;s.player.pitch=-.03;
 if(shot==='start'){s.buy=true;s.timer=10;s.player.x=-26;s.player.z=25;s.player.yaw=-.15;}
 if(shot==='play'){s.phase='live';s.timer=61;s.score=[2,1];s.round=4;equip(s.player,'rifle');Object.assign(s.player,{x:1.4,z:10,hp:82,armor:61,ammo:24,money:2150,yaw:-.10,pitch:.015,fire:.08,recoil:.07});const poses=[[-6,7],[-25,-5],[26,-7],[-21,-20],[2,-11],[4,-22],[-5,-29],[27,-20],[-26,-14]];for(let n=1;n<10;n++){s.actors[n].x=poses[n-1][0];s.actors[n].z=poses[n-1][1];s.actors[n].yaw=n<5?0:Math.PI;s.actors[n].target=n<5?5:0;}tracer(s,w,1.65,1.4,8.5,2,1.3,-11,0);tracer(s,w,2,1.2,-11,1.1,1.4,9,1);s.hit=.12;s.feed=['MICA  ›  ASH'];}
 if(shot==='end'){s.phase='end';s.score=[3,1];s.round=4;s.winner=0;s.reason='CHARGE DETONATED';s.timer=5;s.player.x=-23;s.player.z=-10;s.player.yaw=-.2;equip(s.player,'rifle');s.player.kills=7;s.player.deaths=1;s.player.money=5400;for(let n=5;n<10;n++)s.actors[n].alive=false;s.feed=['YOU  ◆  IRON','FLINT  ›  DUNE'];}
}

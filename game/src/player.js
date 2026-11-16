import {clamp} from './core.js';
import {move} from './world.js';
import {shoot,reload} from './weapons.js';
export function updatePlayer(s,w,i,dt,audio){const p=s.player;if(!p.alive)return;p.yaw-=i.dx*.002;p.pitch=clamp(p.pitch-i.dy*.002,-1.4,1.4);i.dx=i.dy=0;s.aim=i.ads;s.crouch=i.keys.has('ControlLeft')||i.keys.has('ControlRight');p.y+=( (s.crouch?1.08:1.65)-p.y)*Math.min(1,dt*14);
 if(s.phase!=='live'||s.buy){p.vx=p.vz=0;return;}let x=Number(i.keys.has('KeyD'))-Number(i.keys.has('KeyA')),z=Number(i.keys.has('KeyS'))-Number(i.keys.has('KeyW'));if(s.bomb.user===0&&i.keys.has('KeyE'))x=z=0;const len=Math.hypot(x,z)||1,speed=s.crouch?2.1:s.aim?3.1:5.2;x=x/len*speed;z=z/len*speed;const tx=x*Math.cos(p.yaw)+z*Math.sin(p.yaw),tz=-x*Math.sin(p.yaw)+z*Math.cos(p.yaw),rate=dt*(x||z?12:18);p.vx+=(tx-p.vx)*Math.min(1,rate);p.vz+=(tz-p.vz)*Math.min(1,rate);move(w,p,p.vx*dt,p.vz*dt);
 p.step+=Math.hypot(p.vx,p.vz)*dt;if(p.step>2.6){p.step=0;audio.sound('step');}if(i.pressed.has('KeyR'))reload(p,audio);if(i.fire&&i.locked){shoot(s,w,p,p.yaw,p.pitch+p.recoil*.25,audio,(s.aim?.42:1)*(s.crouch?.65:1));}}

export function createInput(canvas,s,audio){const i={keys:new Set(),fire:false,ads:false,dx:0,dy:0,locked:false,pressed:new Set()};
 addEventListener('keydown',e=>{if(['Tab','Space','ControlLeft','ControlRight'].includes(e.code))e.preventDefault();if(!i.keys.has(e.code))i.pressed.add(e.code);i.keys.add(e.code);});addEventListener('keyup',e=>i.keys.delete(e.code));
 addEventListener('blur',()=>{i.keys.clear();i.fire=false;i.ads=false;});
 document.addEventListener('pointerlockchange',()=>{i.locked=document.pointerLockElement===canvas;if(!i.locked){i.fire=false;i.ads=false;}});
 addEventListener('mousemove',e=>{if(i.locked){i.dx+=e.movementX;i.dy+=e.movementY;}});addEventListener('mousedown',e=>{if(i.locked){if(e.button===0)i.fire=true;if(e.button===2)i.ads=true;}});addEventListener('mouseup',e=>{if(e.button===0)i.fire=false;if(e.button===2)i.ads=false;});addEventListener('contextmenu',e=>e.preventDefault());
 document.getElementById('enter').onclick=()=>{s.started=true;audio.unlock();canvas.requestPointerLock();};canvas.onclick=()=>{if(!s.buy&&!s.shot){audio.unlock();canvas.requestPointerLock();}};addEventListener('pointerlockerror',()=>{i.locked=false;});return i;}

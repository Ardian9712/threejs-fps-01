# QUARRYLINE

[![make.fun · threejs-fps-01](https://make.fun/badge/threejs-fps-01.svg)](https://make.fun/bounty/threejs-fps-01?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-01)
[![rank](https://make.fun/badge/threejs-fps-01/Ardian9712/threejs-fps-01/rank.svg)](https://make.fun/bounty/threejs-fps-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-01)
[![reward](https://make.fun/badge/threejs-fps-01/Ardian9712/threejs-fps-01/reward.svg)](https://make.fun/bounty/threejs-fps-01?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-01)

Entry for the [make.fun threejs-fps-01 bounty](https://make.fun/bounty/threejs-fps-01) — build the best three.js FPS. Referral code: `p8atzycs`.

An original procedural tactical shooter set in the Quarry industrial bowl. Cutters attack Crusher A or Silo B against Wardens. First to five rounds wins.

Run `node tools/serve.mjs` and open the printed server's port (default 8080) in desktop Chrome. Click DEPLOY to capture the mouse. All game resources are local static files; no build step or dependency install is needed.

WASD moves, mouse aims, left click fires, right click aims down sights, Ctrl crouches, R reloads, E plants at a site, B opens the preparation buy menu, G throws Frag, Q throws Dust, Tab shows the roster, and Enter starts a rematch after match end. Click the game canvas to capture the mouse after buying. Escape releases the mouse.

Rounds have 10 seconds of preparation and 100 seconds of combat. Plant takes 3 seconds, a charge explodes after 35 seconds, and defenders need 5 seconds to defuse. A planted charge remains live after all attackers fall.

`MAKEFUN_OUTPUT_DIR=out node main.ts` copies the playable files and screenshots and writes the canonical dossier. `?shot=start`, `?shot=play`, and `?shot=end` provide frozen, seeded screenshot states using the same scene, actors, and HUD as normal play.

The simulation uses a 60 Hz fixed step. The game modules cover world/collision, player input and movement, weapons, AI, round and objective rules, economy, grenades, procedural audio, HUD, and screenshot staging. Three.js 0.187.0 is vendored from the competition kit with its original license.

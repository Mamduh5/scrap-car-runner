/** Deliberately replaces only the sky grid. KEEP asset pixel grids are never written. */
import {writeFileSync} from 'node:fs';
import {gridOf} from './pixels.ts';
import {drawSky} from './sky.ts';
writeFileSync(new URL('pixels/env_sky_outskirts.json',import.meta.url),JSON.stringify(gridOf('env_sky_outskirts',drawSky()),null,2)+'\n');
console.log('Sky grid refined; KEEP pixel sources unchanged.');

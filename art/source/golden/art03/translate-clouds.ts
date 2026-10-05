/** Rebuild from original reference crops, never the rejected runtime/cloud grid.
 * Two broad banks retain reference lobes, shadows and height differences at 1x.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {ASSET_BY_ID,expectedFileSize} from '../../../../src/game/assets/assetRegistry.ts';
import {PALETTE,hexToRgb,type PaletteName} from '../../../../src/game/assets/palette.ts';
import {readPng,empty,get,pixel,gridOf} from './pixels.ts';
const src=readPng(readFileSync(new URL('../../../reference/art03_run/clouds_strip_reference.png',import.meta.url)));
const size=expectedFileSize(ASSET_BY_ID.get('env_clouds_strip')!)!;
const out=empty(size.w,size.h);
const names:readonly PaletteName[]=['sky_outskirts_2','sky_outskirts_3'];
function trace(box:readonly[number,number,number,number],dest:readonly[number,number,number,number]):void {
  const [ox,oy,w,h]=dest;
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const samples:number[][]=[];
    for(const sy of [.2,.5,.8]) for(const sx of [.2,.5,.8]) {
      const c=get(src,Math.floor(box[0]+(x+sx)*box[2]/w),Math.floor(box[1]+(y+sy)*box[3]/h));
      if(c[0]!>110 && c[1]!>185 && c[2]!>155 && c[1]!-c[0]!<100) samples.push(c);
    }
    if(samples.length<5) continue;
    const mean=[0,1,2].map(k=>samples.reduce((sum,c)=>sum+c[k]!,0)/samples.length);
    let chosen=names[0]!,best=Infinity;
    for(const name of names) {
      const c=hexToRgb(PALETTE[name]);
      const d=mean.reduce((sum,v,k)=>sum+(v-c[k]!)**2,0);
      if(d<best) {best=d;chosen=name;}
    }
    pixel(out,ox+x,oy+y,[...hexToRgb(PALETTE[chosen]),255]);
  }
}
// Complete isolated upper-right bank moved low; isolated middle-left bank moved
// high. Include their clear-air borders; never crop through the lower cloud wall.
// Reference lobes and long bases are retained, with asymmetric spacing/heights.
trace([1480,300,400,125],[18,40,128,40]);
trace([450,389,360,103],[264,6,96,34]);
// Long, thin atmospheric streaks are separately traced from clear reference gaps.
trace([390,378,225,14],[161,24,60,3]);
trace([1250,390,290,14],[187,66,77,3]);
// Remove disconnected tiny resampling flecks; keep long connected wisps.
const seen=new Set<number>();
for(let y=0;y<out.height;y++) for(let x=0;x<out.width;x++) {
  const start=y*out.width+x;if(seen.has(start)||get(out,x,y)[3]===0) continue;
  const component:number[]=[start];seen.add(start);
  for(let i=0;i<component.length;i++) {
    const at=component[i]!,cx=at%out.width,cy=Math.floor(at/out.width);
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]] as const) {
      const nx=cx+dx,ny=cy+dy,key=ny*out.width+nx;
      if(nx<0||nx>=out.width||ny<0||ny>=out.height||seen.has(key)||get(out,nx,ny)[3]===0) continue;
      seen.add(key);component.push(key);
    }
  }
  if(component.length<4) for(const at of component) pixel(out,at%out.width,Math.floor(at/out.width),[0,0,0,0]);
}
writeFileSync(new URL('pixels/env_clouds_strip.json',import.meta.url),JSON.stringify(gridOf('env_clouds_strip',out),null,2)+'\n');
console.log(`Original reference banks rebuilt: ${out.width}x${out.height}, two broad banks at distinct heights, binary alpha, empty-air join.`);

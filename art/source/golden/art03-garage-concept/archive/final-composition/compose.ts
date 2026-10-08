/** Deterministic CONCEPT REVIEW only. Never writes public/assets or registered sources. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readPng, png, empty, get, pixel, crop, blit, scaled, type Raster } from '../../art03/pixels.ts';
import { PALETTE, hexToRgb } from '../../../../../src/game/assets/palette.ts';

const here=dirname(fileURLToPath(import.meta.url)), root=resolve(here,'../../../../..');
const original=readPng(readFileSync(resolve(here,'../b-refinement/concept-b-refined.png')));
const plate=readPng(readFileSync(resolve(here,'clean-plate-reference.png')));
function sample(p:Raster,x:number,y:number,w:number,h:number,ow:number,oh:number):Raster {
  const out=empty(ow,oh);
  for(let yy=0;yy<oh;yy++) for(let xx=0;xx<ow;xx++)
    pixel(out,xx,yy,get(p,Math.min(p.width-1,Math.floor(x+(xx+.5)*w/ow)),Math.min(p.height-1,Math.floor(y+(yy+.5)*h/oh))));
  return out;
}
const repaired=sample(plate,0,0,plate.width,plate.height,original.width,original.height);
// Preserve accepted source outside vehicle/exhaust/motion and illustrative-status removal windows.
const source=sample(original,0,0,original.width,original.height,original.width,original.height);
for(const [x,y,w,h] of [[78,680,854,365],[390,1100,330,55]])
  for(let yy=y!;yy<y!+h!;yy++) for(let xx=x!;xx<x!+w!;xx++) pixel(source,xx,yy,get(repaired,xx,yy));
const native=sample(source,0,0,source.width,source.height,216,288);
const scene=empty(216,427);
// Real crop: (18,69,180,288); odd vertical surplus gives 69 above / 70 below.
// Roof/lamp geometry stays at the source's 216-wide scale. Repeat a clear sky row
// below the lamp to accommodate the native car without enlarging its pixels.
for(let y=0;y<427;y++) for(let x=0;x<216;x++) {
  const sy=y<69 ? Math.max(0,18-(69-y)/4) : y<180 ? y-51 : y<224 ? 129 : y<304 ? y-95 : 230+Math.max(0,y-314)*57/113;
  pixel(scene,x,y,get(native,x,Math.max(0,Math.floor(sy))));
}
// Replace only the low rig region. Retain its original braces/rollers and shorten
// the central bridge to put rollers under canonical wheel centres x78 and x138.
for(let y=304;y<314;y++) for(let x=0;x<216;x++) pixel(scene,x,y,get(native,x,230));
blit(scene,sample(source,175,1036,260,63,52,10),40,304);
blit(scene,sample(source,435,1036,265,63,32,10),92,304);
blit(scene,sample(source,700,1036,260,63,52,10),124,304);
const asset=(name:string)=>readPng(readFileSync(resolve(root,'public/assets/vehicles',name)));
const body=asset('veh_rustbucket_body.png'),engine=asset('veh_rustbucket_ov_engine_t1.png'),wheels=asset('veh_wheel_tires_t1.png');
const car=empty(112,56);
blit(car,body,0,0);blit(car,engine,0,0);
for(const wx of [26,86]) blit(car,crop(wheels,0,0,24,24),wx-12,32);
// blit intentionally makes drawn pixels opaque; preserve transparent exterior.
const puff=readPng(readFileSync(resolve(root,'public/assets/effects/fx_puff.png')));
blit(scene,crop(puff,0,0,16,16),39,287,hexToRgb(PALETTE.dust_3));
blit(scene,car,52,250);
const safe=crop(scene,18,69,180,288);
function line(p:Raster,x:number,y:number,w:number,h:number,color:number[]) {
  for(let yy=y;yy<y+h;yy++) for(let xx=x;xx<x+w;xx++) pixel(p,xx,yy,color);
}
function box(p:Raster,x:number,y:number,w:number,h:number,color:number[]) {
  line(p,x,y,w,1,color);line(p,x,y+h-1,w,1,color);line(p,x,y,1,h,color);line(p,x+w-1,y,1,h,color);
}
function guides(p:Raster,ox:number,oy:number):Raster {
  const out=crop(p,0,0,p.width,p.height), gold=[255,231,132,255],cyan=[110,189,178,255];
  box(out,18-ox,69-oy,180,288,gold);
  box(out,52-ox,250-oy,112,56,cyan);box(out,40-ox,304-oy,136,10,cyan);
  // Review reservations only, not final UI positions or hit targets.
  box(out,24-ox,75-oy,48,14,gold);box(out,180-ox,75-oy,12,14,gold);
  box(out,68-ox,318-oy,80,10,gold);box(out,24-ox,333-oy,168,18,gold);
  return out;
}
for(const [name,p] of [['composition-216x427.png',scene],['safe-180x288.png',safe],['guides-216x427.png',guides(scene,0,0)],['guides-180x288.png',guides(safe,18,69)],['approved-car-native.png',car]] as const) {
  writeFileSync(resolve(here,name),png(p));
  if(name!=='approved-car-native.png') writeFileSync(resolve(here,name.replace('.png','-3x.png')),png(scaled(p,3)));
}
let carPixels=0,mismatches=0;
for(let y=0;y<56;y++) for(let x=0;x<112;x++) {
  const a=get(car,x,y);if(!a[3])continue;carPixels++;
  if(a.join(',')!==get(scene,x+52,y+250).join(','))mismatches++;
}
if(mismatches)throw new Error('approved car pixel mismatch');
const hash=(file:string)=>createHash('sha256').update(readFileSync(file)).digest('hex');
writeFileSync(resolve(here,'composition-evidence.json'),JSON.stringify({scope:'concept composition only',canvas:[216,427],safe:{x:18,y:69,width:180,height:288,rounding:'floor centered origin; 69 above / 70 below'},car:{x:52,y:250,width:112,height:56,scale:1,engine:'T1',wheelFrame:0,wheelCenters:[[78,294],[138,294]],opaquePixelsVerified:carPixels,mismatches},platform:{x:40,y:304,width:136,height:10,reason:'central bridge shortened to canonical 60-pixel wheel separation; retained original roller/brace forms'},headroom:{safe:28,referenceAt216Wide:46},floor:{safe:43,referenceAt216Wide:71},inputs:['veh_rustbucket_body.png','veh_rustbucket_ov_engine_t1.png','veh_wheel_tires_t1.png'].map(name=>({path:'public/assets/vehicles/'+name,sha256:hash(resolve(root,'public/assets/vehicles',name))})),limitations:['generated environment resampled nearest-neighbour for review; no production palette/source claim','sky row extended below lamp; original roof/lamp/visible yard sampled unchanged outside repair window','guide boxes are review reservations only; no final UI','maximum canvas includes extra atmosphere outside critical crop']},null,2)+'\n');

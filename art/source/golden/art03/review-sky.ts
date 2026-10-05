/** Layered-sky review evidence against the pre-correction byte snapshots. */
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readPng,png,empty,get,pixel,blit,scaled} from './pixels.ts';
import {OUTSKIRTS_SKY_ANCHORS} from '../../../../src/game/assets/skyRamp.ts';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
const beforeDir=process.argv[2]??resolve(tmpdir(),'scrap-art03r-layered-sky-20261005');
const preview=resolve(here,'preview');
const old=readPng(readFileSync(resolve(beforeDir,'run_wide_before.png')));
const current=readPng(readFileSync(resolve(preview,'run_wide_1x.png')));
const comparison=empty(old.width+8+current.width,current.height);
blit(comparison,old,0,0);blit(comparison,current,old.width+8,0);
writeFileSync(resolve(preview,'sky_before_after_1x.png'),png(comparison));
const load=(id:string)=>readPng(readFileSync(resolve(root,'public/assets/environments',id+'.png')));
const sky=load('env_sky_outskirts'),clouds=load('env_clouds_strip');
const repeated=empty(512,300);
for(let y=0;y<300;y++) for(let x=0;x<512;x++) pixel(repeated,x,y,get(sky,x%16,y));
writeFileSync(resolve(preview,'sky_tile_repeat_1x.png'),png(repeated));
writeFileSync(resolve(preview,'sky_tile_repeat_4x.png'),png(scaled(repeated,4)));
const baseline=JSON.parse(readFileSync(resolve(beforeDir,'before-hashes.json'),'utf8')) as {path:string;sha256:string}[];
const keepIds=['env_road_asphalt','env_far_junkyard','prop_scrap_pile_a','fx_puff'];
const preserved=baseline.filter(f=>keepIds.some(id=>f.path.replaceAll('\\','/').endsWith('/'+id+'.png')||f.path.replaceAll('\\','/').endsWith('/'+id+'.json'))).map(f=>({...f,unchanged:createHash('sha256').update(readFileSync(resolve(root,f.path))).digest('hex')===f.sha256}));
let changedRoadPixels=0,skyEdgeMismatches=0,cloudEdgeMismatches=0,skyNonuniformRows=0,maxSkyChannelStep=0,opaqueCloudPixels=0;
for(let y=current.height-48;y<current.height;y++) for(let x=0;x<current.width;x++) if(get(old,x,y).join(',')!==get(current,x,y).join(',')) changedRoadPixels++;
for(let y=0;y<sky.height;y++) {
  if(get(sky,0,y).join(',')!==get(sky,15,y).join(',')) skyEdgeMismatches++;
  if(Array.from({length:16},(_,x)=>get(sky,x,y).join(',')).some(c=>c!==get(sky,0,y).join(','))) skyNonuniformRows++;
  if(y>0) for(let k=0;k<3;k++) maxSkyChannelStep=Math.max(maxSkyChannelStep,Math.abs(get(sky,0,y)[k]!-get(sky,0,y-1)[k]!));
}
for(let y=0;y<48;y++) {
  if(get(clouds,0,y).join(',')!==get(clouds,255,y).join(',')) cloudEdgeMismatches++;
  for(let x=0;x<256;x++) if(get(clouds,x,y)[3]!==0) opaqueCloudPixels++;
}
let cloudSmallestPeriod=256;
for(let period=1;period<256;period++) {
  let equal=true;
  for(let y=0;y<48&&equal;y++) for(let x=0;x<256;x++) if(get(clouds,x,y).join(',')!==get(clouds,(x+period)%256,y).join(',')) {equal=false;break;}
  if(equal) {cloudSmallestPeriod=period;break;}
}
const protectedOthers=baseline.filter(f=>f.path.replaceAll('\\','/').startsWith('public/assets/')&&!keepIds.some(id=>f.path.endsWith(id+'.png'))&&!f.path.endsWith('env_sky_outskirts.png'));
const otherRuntimeChanges=protectedOthers.filter(f=>createHash('sha256').update(readFileSync(resolve(root,f.path))).digest('hex')!==f.sha256).map(f=>f.path);
const evidence={scope:'ART-03R layered sky only; owner review pending',beforeAfter:'Left: rejected ordered-dither sky; right: new reference RGB sky plus cloud overlay',
  authorization:'Owner explicitly allowed a sky-only RGB ramp on 2026-10-05; 16x300, opaque alpha and tile contract retained',
  references:['sky_base_reference.png','clouds_strip_reference.png','sky_composite_reference.png','far_junkyard_reference.png'],
  sky:{width:16,height:300,repetitions:32,skyEdgeMismatches,skyNonuniformRows,maxSkyChannelStep,anchors:OUTSKIRTS_SKY_ANCHORS},
  clouds:{width:256,height:48,repetitions:3,cloudEdgeMismatches,cloudSmallestPeriod,opaqueCloudPixels,emptyPixels:256*48-opaqueCloudPixels,alpha:[0,255],seam:'four fully transparent columns at each boundary; empty-air join'},
  preserved,changedRoadPixels,otherRuntimeChanges,
  visualReview:'Standard/wide/background-only and repeated-cloud previews inspected at 1x; calm atmosphere, sparse horizontal cloud banks, readable far and primary Rustbucket focus. Full 256px repetition remains visible in wide proof; no shorter subperiod. Owner approval pending.'};
writeFileSync(resolve(here,'sky-review.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
process.exitCode=preserved.length===8&&preserved.every(f=>f.unchanged)&&changedRoadPixels===0&&skyEdgeMismatches===0&&cloudEdgeMismatches===0&&skyNonuniformRows===0&&maxSkyChannelStep<=2&&cloudSmallestPeriod===256&&otherRuntimeChanges.length===0?0:1;

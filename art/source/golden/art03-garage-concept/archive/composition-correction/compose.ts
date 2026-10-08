/** Composition review only. Retains prior pixels; never writes runtime assets. */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readPng, png, empty, get, pixel, crop, scaled, type Raster } from '../../art03/pixels.ts';
import { PALETTE, hexToRgb } from '../../../../../src/game/assets/palette.ts';

const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../../..');
const read=(p:string)=>readFileSync(p,'utf8').replace(/^\uFEFF/,'');
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const baseline=JSON.parse(read(resolve(here,'preservation-baseline.json')));
const protectedFiles=baseline.files.map((f:{path:string;sha256:string})=>({...f,afterSha256:hash(resolve(root,f.path))}));
if(protectedFiles.some((f:{sha256:string;afterSha256:string})=>f.sha256!==f.afterSha256))throw new Error('protected input changed');
const prior=readPng(readFileSync(resolve(here,'../final-composition/composition-216x427.png')));
const car=readPng(readFileSync(resolve(here,'../final-composition/approved-car-native.png')));
const scene=empty(216,427),reserve=[...hexToRgb(PALETTE.ink_1),255];
// Delete exactly the 44-row inserted sky band. Keep roof/lamp pixels fixed,
// translate everything below it up 44, and retain 18 rows of pavement below rig.
// Owner selected a complete 1x car and a plain UI reserve after the compact floor.
for(let y=0;y<427;y++)for(let x=0;x<216;x++)
  pixel(scene,x,y,y<180?get(prior,x,y):y<288?get(prior,x,y+44):reserve);
const safe=crop(scene,18,69,180,288);
function box(p:Raster,x:number,y:number,w:number,h:number,color:number[]) {
  for(let xx=x;xx<x+w;xx++){pixel(p,xx,y,color);pixel(p,xx,y+h-1,color);}
  for(let yy=y;yy<y+h;yy++){pixel(p,x,yy,color);pixel(p,x+w-1,yy,color);}
}
const guided=crop(scene,0,0,216,427),gold=[255,231,132,255],teal=[110,189,178,255];
box(guided,18,69,180,288,gold);
box(guided,52,206,112,56,teal);box(guided,40,260,136,10,teal);
box(guided,24,75,48,14,gold);box(guided,180,75,12,14,gold);
box(guided,68,274,80,10,gold);box(guided,24,333,168,18,gold);
let carPixels=0;
for(let y=0;y<56;y++)for(let x=0;x<112;x++)if(get(car,x,y)[3]) {
  carPixels++;if(get(car,x,y).join(',')!==get(scene,x+52,y+206).join(','))throw new Error('approved car pixel mismatch');
}
// These assertions verify the preservation seam, not a new artistic approximation.
let fixedPixels=0,translatedPixels=0;
for(let y=0;y<288;y++)for(let x=0;x<216;x++) {
  const original=get(prior,x,y<180?y:y+44);
  if(get(scene,x,y).join(',')!==original.join(','))throw new Error('environment changed beyond placement');
  if(y<180)fixedPixels++;else translatedPixels++;
}
const outputs=[];
for(const [name,p] of [['clean-216x427.png',scene],['guided-216x427.png',guided],['clean-180x288.png',safe],['guided-180x288.png',crop(guided,18,69,180,288)]] as const) {
  for(const scale of [1,3]) {
    const file=scale===1?name:name.replace('.png','-3x.png'),out=scale===1?p:scaled(p,scale);
    writeFileSync(resolve(here,file),png(out));
    outputs.push({path:file,width:out.width,height:out.height,sha256:hash(resolve(here,file))});
  }
}
writeFileSync(resolve(here,'composition-evidence.json'),JSON.stringify({date:'2026-10-08',scope:'composition correction only',status:'GARAGE COMPOSITION CORRECTION — READY FOR OWNER REVIEW',ownerDecision:'complete 1x car; compact floor ending above a plain UI reserve',canvas:[216,427],safe:{x:18,y:69,width:180,height:288},car:{before:[52,250],after:[52,206],size:[112,56],scale:1,pixelsVerified:carPixels,mismatches:0},platform:{before:[40,304],after:[40,260],size:[136,10],redesigned:false},framing:{removedMiddleSkyRows:44,carAndRigUp:44,canopyAndLampMoved:false,headroomUnchanged:28,pavementBelowRigBefore:43,pavementBelowRigAfter:18,plainReserveStartsAtY:288,plainReserveWithinSafe:69,plainReserveColor:PALETTE.ink_1,uiGeometryFinal:false},preservation:{count:protectedFiles.length,changed:0,files:protectedFiles,fixedEnvironmentPixels:fixedPixels,translatedEnvironmentPixels:translatedPixels,environmentMismatch:0},outputs,production:{started:false,lifecycleChanges:false},limitations:['plain UI reserve is distinct from pavement; empty lower space is not claimed to disappear','generated environment remains concept material; no production palette/source or in-game proof','integer safe origin leaves 69 pixels above and 70 below']},null,2)+'\n');
console.log(JSON.stringify({carPixels,fixedPixels,translatedPixels,protectedFiles:protectedFiles.length,outputs:outputs.length}));

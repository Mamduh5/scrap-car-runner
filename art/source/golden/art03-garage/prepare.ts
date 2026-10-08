/** Review/preparation only. Production pixels are authored in Aseprite by author.lua. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { PALETTE, hexToRgb } from '../../../../src/game/assets/palette.ts';
import { empty, readPng, png, get, pixel, crop, blit, scaled, type Raster } from '../art03/pixels.ts';
const root=process.cwd(), here=resolve(root,'art/source/golden/art03-garage');
const prep=resolve(root,'art/source/golden/art03-garage-concept/production-preparation');
mkdirSync(resolve(prep,'guides'),{recursive:true}); mkdirSync(resolve(here,'review'),{recursive:true});
const write=(p:string,v:unknown)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const hash=(p:string)=>createHash('sha256').update(readFileSync(resolve(root,p))).digest('hex');
const walk=(d:string):string[]=>readdirSync(resolve(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const protectedPaths=[...['art/source/golden/art01','art/source/golden/art02','art/source/golden/art03','art/reference/art03_run','public/assets','src'].flatMap(walk)];
if(!existsSync(resolve(here,'preservation-baseline.json')))write(resolve(here,'preservation-baseline.json'),{date:'2026-10-08',files:protectedPaths.map(path=>({path,sha256:hash(path)}))});
writeFileSync(resolve(here,'palette.lua'),'-- Generated from canonical palette.ts; do not expand locally.\nreturn {\n'+Object.entries(PALETTE).map(([k,v])=>`  ${k}={${hexToRgb(v).join(',')}},`).join('\n')+'\n}\n');
const selectedPath='art/source/golden/art03-garage-concept/single-image-review/garage-b-tight.png';
const selected=readPng(readFileSync(resolve(root,selectedPath)));
if(selected.width!==540||selected.height!==654)throw Error('Selected reference changed dimensions');
const native=empty(180,218); let repeatMismatch=0;
for(let y=0;y<218;y++)for(let x=0;x<180;x++) {
 const c=get(selected,x*3,y*3);pixel(native,x,y,c);
 for(let yy=0;yy<3;yy++)for(let xx=0;xx<3;xx++)if(get(selected,x*3+xx,y*3+yy).join()!=c.join())repeatMismatch++;
}
if(repeatMismatch)throw Error('Reference is not exact 3x');
const asset=(id:string)=>readPng(readFileSync(resolve(root,'public/assets/vehicles/'+id+'.png')));
const car=empty(112,56),body=asset('veh_rustbucket_body'),engine=asset('veh_rustbucket_ov_engine_t1'),wheel=crop(asset('veh_wheel_tires_t1'),0,0,24,24);
blit(car,body,0,0);blit(car,engine,0,0);blit(car,wheel,14,32);blit(car,wheel,74,32);
let selectedCarMismatch=0,visible=0;
for(let y=0;y<56;y++)for(let x=0;x<112;x++)if(get(car,x,y)[3]) {visible++;if(get(car,x,y).join()!=get(native,x+34,y+123).join())selectedCarMismatch++;}
if(selectedCarMismatch)throw Error('Selected car differs from approved body/engine/wheels');
writeFileSync(resolve(here,'review/approved-car.png'),png(car));
// ONE translation anchor, not a new concept. Extension is schematic preparation only.
const core={x:18,y:104,w:180,h:218},carBox={x:52,y:227,w:112,h:56},lift={x:40,y:281,w:136,h:20};
const mapping=empty(216,427);
for(let y=0;y<427;y++)for(let x=0;x<216;x++) {
 const sx=Math.max(0,Math.min(179,x-core.x)),sy=Math.max(0,Math.min(217,y-core.y));
 pixel(mapping,x,y,get(native,sx,sy));
}
blit(mapping,car,carBox.x,carBox.y);
const colors={safe:[255,231,132,255],lift:[224,58,40,255],car:[110,189,178,255],wall:[111,180,245,255],exclude:[255,0,255,255]};
function rect(p:Raster,x:number,y:number,w:number,h:number,c:number[]) {for(let xx=x;xx<x+w;xx++){pixel(p,xx,y,c);pixel(p,xx,y+h-1,c);}for(let yy=y;yy<y+h;yy++){pixel(p,x,yy,c);pixel(p,x+w-1,yy,c);}}
function cross(p:Raster,x:number,y:number,c:number[]) {for(let d=-3;d<=3;d++){pixel(p,x+d,y,c);pixel(p,x,y+d,c);}}
const guided=crop(mapping,0,0,216,427);
rect(guided,18,69,180,288,colors.safe);rect(guided,18,104,180,218,colors.wall);
rect(guided,52,227,112,56,colors.car);rect(guided,40,281,136,20,colors.lift);
for(const x of [78,138])cross(guided,x,271,colors.lift);
// Review reservation only, never final controls or hit targets.
const reserves=[{id:'Scrap',x:24,y:75,w:48,h:14},{id:'Mail',x:180,y:75,w:12,h:14},{id:'Fuel / Heat / Speed',x:66,y:311,w:84,h:12},{id:'Workshop | Garage | Scavenge',x:24,y:333,w:168,h:18}];
for(const b of reserves)rect(guided,b.x,b.y,b.w,b.h,colors.exclude);
rect(guided,37,260,18,19,colors.exclude); // Existing concept exhaust, omitted in final art.
const separation=empty(216,427);
for(let y=0;y<427;y++)for(let x=0;x<216;x++)pixel(separation,x,y,[59,63,78,255]);
for(let y=281;y<301;y++)for(let x=40;x<176;x++)pixel(separation,x,y,colors.lift);
for(let y=0;y<56;y++)for(let x=0;x<112;x++)if(get(car,x,y)[3])pixel(separation,x+52,y+227,colors.exclude);
rect(separation,18,69,180,288,colors.safe);
for(const b of reserves)rect(separation,b.x,b.y,b.w,b.h,colors.exclude);
rect(separation,37,260,18,19,colors.exclude);
for(const [name,p] of [['mapping-216x427',mapping],['guided-216x427',guided],['mapping-180x288',crop(mapping,18,69,180,288)],['guided-180x288',crop(guided,18,69,180,288)],['separation-216x427',separation]] as const) {
 writeFileSync(resolve(prep,'guides/'+name+'.png'),png(p));
}
write(resolve(prep,'mapping.json'),{date:'2026-10-08',stage:'preparation only; schematic edge extension is not production pixels',reference:{path:selectedPath,sha256:hash(selectedPath),native:[180,218],scale:3,repeatMismatch},canvas:[216,427],safe:{x:18,y:69,w:180,h:288},core,car:{...carBox,visiblePixels:visible,selectedCarMismatch,inputs:['veh_rustbucket_body','veh_rustbucket_ov_engine_t1','veh_wheel_tires_t1'],wheelFrame:0},lift:{...lift,visibleProfileHeight:10,contactY:281,wheelCenters:[[78,271],[138,271]],localWheelCenters:[[38,-10],[98,-10]]},reserves,separation:{wall:'All canvas positions have opaque authored wall, INCLUDING behind car and lift. Steel fill in map indicates wall responsibility, not a pixel mask.',lift:'Red 136x20 box is the separate cutout canvas; actual occupied pixels will be a 10px profile.',exclusions:'Magenta: runtime car silhouette, concept exhaust and potential UI regions. All vehicle/wheels/overlays, smoke, UI, labels, checkpoint controls are excluded from BOTH exports. Backdrop is still authored beneath these regions.'},guideLegend:{yellow:'centered safe area',blue:'selected 180x218 core',teal:'exact approved car bounds',red:'lift canvas and wheel centers',magenta:'excluded runtime overlays / provisional UI reservations'},anchorApproval:'candidate translation; pending owner production visual review'});
console.log('Preparation mapping and guides written. Exact car pixels verified:',visible);

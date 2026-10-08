import {readFileSync,writeFileSync,existsSync}from'node:fs';
import {createHash}from'node:crypto';
import{decodePng}from'../../../../tools/assets/png.ts';
import{paletteRgbSet}from'../../../../src/game/assets/palette.ts';
const here='art/source/golden/art03-garage',concept='art/source/golden/art03-garage-concept';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const before=read(here+'/preservation-baseline.json') as {files:{path:string,sha256:string}[]};
const changed=before.files.filter(e=>!existsSync(e.path)||hash(e.path)!==e.sha256);
if(changed.length)throw Error('Protected files changed: '+JSON.stringify(changed));
const archive=read(concept+'/production-preparation/cleanup-manifest.json') as {files:{original:string,retained:string,disposition:string,sha256:string}[]};
// Every original is retained at its mapped path or historical snapshot.
const archived=archive.files;
for(const e of archived)if(hash(e.retained)!==e.sha256)throw Error('Historical evidence changed: '+e.retained);
const allowed=paletteRgbSet();
const checks=['env_garage_wall','env_garage_lift'].map(id=>{
 const path='public/assets/environments/'+id+'.png',p=decodePng(readFileSync(path));
 if(['gAMA','iCCP','cHRM'].some(c=>p.chunkTypes.includes(c)))throw Error('Forbidden color-management chunk: '+id);
 let offPalette=0,transparent=0,semi=0;const colors=new Set<string>();
 const bounds={x:p.width,y:p.height,right:-1,bottom:-1};
 for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++){
  const i=(y*p.width+x)*4,a=p.rgba[i+3]!;
  if(!a){transparent++;continue;}if(a!==255)semi++;
  const rgb=(p.rgba[i]!<<16)|(p.rgba[i+1]!<<8)|p.rgba[i+2]!;if(!allowed.has(rgb))offPalette++;
  colors.add('#'+rgb.toString(16).padStart(6,'0'));
  bounds.x=Math.min(bounds.x,x);bounds.y=Math.min(bounds.y,y);bounds.right=Math.max(bounds.right,x);bounds.bottom=Math.max(bounds.bottom,y);
 }
 const isWall=id.endsWith('wall');
 if(p.width!==(isWall?216:136)||p.height!==(isWall?427:20)||offPalette||semi||(isWall?transparent!==0:transparent===0))throw Error('Asset contract failed: '+id);
 const reviewed=decodePng(readFileSync(here+'/review/'+(isWall?'wall':'lift')+'-candidate.png'));
 if(!Buffer.from(p.rgba).equals(Buffer.from(reviewed.rgba)))throw Error('Reviewed candidate differs from master export');
 return{id,path,sha256:hash(path),dimensions:[p.width,p.height],transparentPixels:transparent,semiTransparentPixels:semi,offPalettePixels:offPalette,colors:[...colors],visibleBounds:bounds,chunks:p.chunkTypes,reviewPixelMatch:true};
});
const full=decodePng(readFileSync(here+'/review/clean-216x427.png')),safe=decodePng(readFileSync(here+'/review/clean-180x288.png'));
let cropMismatch=0;
for(let y=0;y<288;y++)for(let x=0;x<180;x++)for(let k=0;k<4;k++)if(safe.rgba[(y*180+x)*4+k]!==full.rgba[((y+69)*216+x+18)*4+k])cropMismatch++;
if(cropMismatch)throw Error('Safe crop differs');
writeFileSync(here+'/validation.json',JSON.stringify({date:'2026-10-08',protectedFiles:before.files.length,changedProtectedFiles:changed.length,archiveEvidenceFilesVerified:archived.length,deletedFiles:0,checks,safeCrop:{origin:[18,69],size:[180,288],mismatches:cropMismatch},contentReview:'Source-layer inspection and visual review: no car/lift/UI/smoke in wall; no car in lift. Semantic exclusions are not inferred from numeric palette checks.',lifecycle:'Both registry entries remain planned; owner production visual review pending.'},null,2)+'\n');
console.log('PASS:',before.files.length,'protected files;',archived.length,'historical/current original files verified; both candidates pass dimensions/alpha/palette and exact reviewed-pixel checks.');

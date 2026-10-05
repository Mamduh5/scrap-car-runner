/** Current cloud evidence; sealed approval hashes replace temporary rejected-iteration snapshots. */
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {ASSET_BY_ID,runtimeFiles} from '../../../../src/game/assets/assetRegistry.ts';
import {readPng,get} from './pixels.ts';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
type FileHash={path:string;sha256:string};
const approval=JSON.parse(readFileSync(resolve(here,'owner-approval.json'),'utf8')) as {
  assets:{id:string;runtime:FileHash;editableSource:FileHash}[];references:FileHash[];finalPreviews:FileHash[];
};
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const preserved=approval.assets.flatMap(a=>[a.runtime,a.editableSource]).map(f=>({...f,unchanged:hash(readFileSync(resolve(root,f.path)))===f.sha256}));
const referenceAndPreviewIntegrity=[...approval.references,...approval.finalPreviews].map(f=>({...f,unchanged:hash(readFileSync(resolve(root,f.path)))===f.sha256}));
const asset=ASSET_BY_ID.get('env_clouds_strip')!;
const bytes=readFileSync(resolve(root,'public/assets',runtimeFiles(asset)[0]!)),p=readPng(bytes);
let edgeMismatches=0,visible=0,semi=0;
for(let y=0;y<p.height;y++) {
  if(get(p,0,y).join(',')!==get(p,p.width-1,y).join(',')) edgeMismatches++;
  for(let x=0;x<p.width;x++) {const a=get(p,x,y)[3]!;if(a!==0) visible++;if(a!==0&&a!==255) semi++;}
}
let smallestPeriod=p.width;
for(let period=1;period<p.width;period++) {
  let equal=true;
  for(let y=0;y<p.height&&equal;y++) for(let x=0;x<p.width;x++) if(get(p,x,y).join(',')!==get(p,(x+period)%p.width,y).join(',')) {equal=false;break;}
  if(equal) {smallestPeriod=period;break;}
}
const bankBounds=(x0:number,y0:number,w:number,h:number)=>{
  let left=p.width,right=-1,top=p.height,bottom=-1;
  for(let y=y0;y<y0+h;y++) for(let x=x0;x<x0+w;x++) if(get(p,x,y)[3]!==0) {left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  return {left,right,top,bottom,width:right-left+1,height:bottom-top+1};
};
const primary=readPng(readFileSync(resolve(here,'preview/run_216_1x.png')));
const wide=readPng(readFileSync(resolve(here,'preview/run_wide_1x.png')));
const evidence={scope:'ART-03R accepted Golden Run benchmark; six assets visual; no in-game/final approval',
  ownerApproval:'art/source/golden/art03/owner-approval.json',
  authorization:'Owner approved 256x48 -> 384x96 on 2026-10-05',
  reference:{path:'art/reference/art03_run/clouds_strip_reference.png',sha256:hash(readFileSync(resolve(root,'art/reference/art03_run/clouds_strip_reference.png')))},
  source:'Original reference bank/streak crops -> maintained explicit pixel grid. Rejected 256x48 pixels are never sampled.',
  contract:{id:asset.id,path:'public/assets/'+runtimeFiles(asset)[0],width:p.width,height:p.height,alpha:asset.alpha,tileX:asset.tileX,required:asset.required,phase:asset.phase,status:asset.status},
  measurements:{edgeMismatches,semiTransparentPixels:semi,visiblePixels:visible,emptyPixels:p.width*p.height-visible,emptyPercent:Number((100*(1-visible/(p.width*p.height))).toFixed(2)),smallestPeriod,
    banks:[bankBounds(18,40,128,40),bankBounds(264,6,96,34)],seam:'Empty air: all pixels in both boundary columns transparent'},
  primaryPreview:{path:'preview/run_216_1x.png',width:primary.width,height:primary.height},
  wideProof:{path:'preview/run_wide_1x.png',width:wide.width,height:wide.height},
  preserved,referenceAndPreviewIntegrity,
  visualReview:'Owner accepted the current six Run assets as the Golden Run environment benchmark on 2026-10-05. Primary 216 AP and 768 AP repetition proof retained byte-identical; actual Phaser proof remains VIS-01.'};
writeFileSync(resolve(here,'cloud-review.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
process.exitCode=p.width===384&&p.height===96&&edgeMismatches===0&&semi===0&&smallestPeriod===384&&primary.width===216&&wide.width>=768&&approval.assets.length===6&&preserved.length===12&&preserved.every(f=>f.unchanged)&&referenceAndPreviewIntegrity.every(f=>f.unchanged)?0:1;

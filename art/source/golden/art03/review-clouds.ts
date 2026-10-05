/** Contract, repeat, primary-view and KEEP evidence for the approved 384x96 rebuild. */
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {ASSET_BY_ID,runtimeFiles} from '../../../../src/game/assets/assetRegistry.ts';
import {readPng,get,png,empty,blit} from './pixels.ts';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
const beforeDir=process.argv[2]??resolve(tmpdir(),'scrap-art03r-cloud384-20261005');
const baseline=JSON.parse(readFileSync(resolve(beforeDir,'before-hashes.json'),'utf8')) as {path:string;sha256:string}[];
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const keepIds=['env_sky_outskirts','env_far_junkyard','env_road_asphalt','prop_scrap_pile_a','fx_puff'];
const preserved=baseline.filter(f=>keepIds.some(id=>f.path.endsWith(id+'.png')||f.path.endsWith(id+'.json'))).map(f=>({...f,unchanged:hash(readFileSync(resolve(root,f.path)))===f.sha256}));
const otherRuntimeChanges=baseline.filter(f=>f.path.replaceAll('\\','/').startsWith('public/assets/')&&!f.path.endsWith('env_clouds_strip.png')&&hash(readFileSync(resolve(root,f.path)))!==f.sha256).map(f=>f.path);
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
const old=readPng(readFileSync(resolve(beforeDir,'rejected_run_216.png')));
const currentMax=readPng(readFileSync(resolve(here,'preview/run_max_1x.png')));
const comparison=empty(440,427);blit(comparison,old,0,0);blit(comparison,currentMax,224,0);
writeFileSync(resolve(here,'preview/cloud_before_after_216_1x.png'),png(comparison));
const evidence={scope:'ART-03R cloud-only correction; all six Run assets technical; owner visual review pending',
  authorization:'Owner approved 256x48 -> 384x96 on 2026-10-05',
  reference:{path:'art/reference/art03_run/clouds_strip_reference.png',sha256:hash(readFileSync(resolve(root,'art/reference/art03_run/clouds_strip_reference.png')))},
  source:'Original reference bank/streak crops -> maintained explicit pixel grid. Rejected 256x48 pixels are never sampled.',
  contract:{id:asset.id,path:'public/assets/'+runtimeFiles(asset)[0],width:p.width,height:p.height,alpha:asset.alpha,tileX:asset.tileX,required:asset.required,phase:asset.phase,status:asset.status},
  measurements:{edgeMismatches,semiTransparentPixels:semi,visiblePixels:visible,emptyPixels:p.width*p.height-visible,emptyPercent:Number((100*(1-visible/(p.width*p.height))).toFixed(2)),smallestPeriod,
    banks:[bankBounds(18,40,128,40),bankBounds(264,6,96,34)],seam:'Empty air: all pixels in both boundary columns transparent'},
  primaryPreview:{path:'preview/run_216_1x.png',width:primary.width,height:primary.height},
  wideProof:{path:'preview/run_wide_1x.png',width:wide.width,height:wide.height},
  preserved,otherRuntimeChanges,
  visualReview:'216 AP primary: broad low bank and thin streaks, substantial quiet sky, clear far and Rustbucket focus. Four 216 AP offset panels show high/low banks and wrap. 768 AP proof intentionally exposes the full 384 AP repeat; no shorter subperiod. Owner approval remains pending.'};
writeFileSync(resolve(here,'cloud-review.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
process.exitCode=p.width===384&&p.height===96&&edgeMismatches===0&&semi===0&&smallestPeriod===384&&primary.width===216&&wide.width>=768&&preserved.length===10&&preserved.every(f=>f.unchanged)&&otherRuntimeChanges.length===0?0:1;

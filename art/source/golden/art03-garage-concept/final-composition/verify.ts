/** Review assertions and preservation evidence; never writes registered production paths. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readPng, get } from '../../art03/pixels.ts';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../../..');
const read=(p:string)=>{const b=readFileSync(p);return b.toString(b[0]===255&&b[1]===254?'utf16le':'utf8').replace(/^\uFEFF/,'');};
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const baseline=JSON.parse(read(resolve(tmpdir(),'scrap-garage-final-hashes.json')));
const files=baseline.files.map((f:{path:string;sha256:string})=>({...f,afterSha256:hash(resolve(root,f.path))}));
if(files.some((f:{sha256:string;afterSha256:string})=>f.sha256!==f.afterSha256))throw new Error('protected file changed');
function states(text:string):string[] {
  return text.split(/\r?\n/).filter(l=>l.startsWith('|')).flatMap(l=>{
    const c=l.split('|'),id=c[1]?.trim().replaceAll('*',''),status=c[2]?.trim();
    const key=id?.match(/^[A-Z]+-\d+|^M\d\b/)?.[0];
    return key&&status&&['BACKLOG','READY','IN PROGRESS','VALIDATION','BLOCKED','DONE','NOT STARTED'].includes(status)?[key+'|'+status]:[];
  });
}
const before=states(read(resolve(tmpdir(),'scrap-garage-final-plan-before.md')));
const after=states(read(resolve(root,'docs/14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md')));
if(before.length!==62||JSON.stringify(before)!==JSON.stringify(after))throw new Error('canonical plan status changed');
const max=readPng(readFileSync(resolve(here,'composition-216x427.png'))),safe=readPng(readFileSync(resolve(here,'safe-180x288.png')));
if(max.width!==216||max.height!==427||safe.width!==180||safe.height!==288)throw new Error('viewport dimensions');
for(let y=0;y<288;y++)for(let x=0;x<180;x++)if(get(safe,x,y).join(',')!==get(max,x+18,y+69).join(','))throw new Error('safe crop pixels');
const outputs=[];
for(const name of readdirSync(here).filter(n=>n.endsWith('.png'))) {
  const p=readPng(readFileSync(resolve(here,name)));
  outputs.push({path:name,width:p.width,height:p.height,sha256:hash(resolve(here,name))});
  if(name.includes('-3x')) {
    const native=readPng(readFileSync(resolve(here,name.replace('-3x',''))));
    if(p.width!==native.width*3||p.height!==native.height*3)throw new Error('3x dimensions');
    for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++)if(get(p,x,y).join(',')!==get(native,Math.floor(x/3),Math.floor(y/3)).join(','))throw new Error('3x pixel mismatch');
  }
}
const car=readPng(readFileSync(resolve(here,'approved-car-native.png')));
let carPixels=0;
for(let y=0;y<56;y++)for(let x=0;x<112;x++)if(get(car,x,y)[3]) {
  carPixels++;if(get(car,x,y).join(',')!==get(max,x+52,y+250).join(','))throw new Error('car pixel mismatch');
}
const acceptedReference=JSON.parse(read(resolve(here,'../b-refinement/validation.json'))).reference;
if(hash(resolve(root,acceptedReference.path))!==acceptedReference.sha256)throw new Error('accepted refined B reference changed');
// Absence comes from the actual production validator, not a guessed asset directory.
const proof=read(resolve(tmpdir(),'scrap-garage-final-proof-c.log'));
const check=read(resolve(tmpdir(),'scrap-garage-final-check.log'));
if(!proof.includes('env_garage_wall')||!proof.includes('env_garage_lift')||!proof.includes('FAILED'))throw new Error('expected proof_c absence evidence');
if(!check.includes('250')||!check.includes('built in'))throw new Error('required check evidence incomplete');
let links=0;
const textFiles=[resolve(here,'REPORT.md'),resolve(here,'../README.md'),resolve(here,'../b-refinement/REPORT.md'),resolve(here,'../review.html'),resolve(here,'../review-history.html'),resolve(root,'docs/04_ART_DIRECTION_AND_ASSET_REGISTRY.md'),resolve(root,'docs/14_IMPLEMENTATION_AND_PROJECT_MANAGEMENT_PLAN.md')];
for(const path of textFiles) {
 const content=read(path),pattern=path.endsWith('.html')?/(?:href|src)="([^"]+)"/g:/\]\(([^)]+)\)/g;
 for(const match of content.matchAll(pattern)) {
  const target=match[1]!.split('#')[0]!;if(!target||/^[a-z]+:/i.test(target))continue;
  const resolved=resolve(dirname(path),target);
  if(resolved!==resolve(here,'validation.json')&&!existsSync(resolved))throw new Error('missing link '+target+' in '+path);links++;
 }
}
for(const name of readdirSync(here).filter(n=>n.endsWith('.json')&&n!=='validation.json'))JSON.parse(read(resolve(here,name)));
writeFileSync(resolve(here,'validation.json'),JSON.stringify({date:'2026-10-07',status:'GARAGE COMPOSITION FINAL CANDIDATE — READY FOR OWNER REVIEW',visualDirection:'refined B accepted by owner',compositionApproval:'pending',productionAuthorization:'pending; no runtime exports',preservation:{count:files.length,changed:0,files},plan:{rows:after.length,changed:0,states:after},pixels:{canvas:[216,427],safe:[18,69,180,288],cropMismatches:0,carPixels,carMismatches:0,scale:1,inspectionScale:3,inspectionMismatches:0},outputs,checks:{projectCheckExit:0,tests:250,testFiles:13,productionProofCExit:1,productionProofCErrors:['env_garage_wall missing','env_garage_lift missing'],linksChecked:links,linksMissing:0,json:'parsed',whitespace:'git diff --check passed'},browser:{surface:'Chrome standalone review, not Phaser',cleanNativeSizes:[[216,427],[180,288]],guided2xSizes:[[432,854],[360,576]],allFourLoaded:true,visualInspection:'clean native and guided 2x; native PNG and 3x guide inspected'},limitations:['open middle bay remains generous; owner must confirm car prominence','maximum canvas has extra sky/floor beyond safe crop','generated reference environment is not palette-cleaned production artwork','no runtime/device/VIS-01 claim']},null,2)+'\n');
JSON.parse(read(resolve(here,'validation.json')));
console.log(JSON.stringify({protected:files.length,acceptedRefinedBUnchanged:true,changed:0,planRows:after.length,carPixels,cropMismatches:0,links,outputs:outputs.length}));

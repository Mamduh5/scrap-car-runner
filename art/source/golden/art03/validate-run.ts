/** Scope evidence over the existing full-registry validator; does not change/relax its gate. */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {ASSET_REGISTRY,runtimeFiles} from '../../../../src/game/assets/assetRegistry.ts';
import {PALETTE,PALETTE_STATUS,MAX_PALETTE_COLORS,renderGpl} from '../../../../src/game/assets/palette.ts';
import {PARTS} from '../../../../src/data/parts.ts';
import {CHASSIS_LIST} from '../../../../src/data/chassis.ts';
import {ROADS} from '../../../../src/data/roads.ts';
import {validateAssets,nodeFs} from '../../../../tools/assets/validateAssets.ts';
import {readPng,raster,png,get,type PixelGrid} from './pixels.ts';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
const ids=['env_sky_outskirts','env_clouds_strip','env_far_junkyard','env_road_asphalt','prop_scrap_pile_a','fx_puff'];
const gpl=resolve(root,'art/palette/scrap-master.gpl');
const report=validateAssets({registry:ASSET_REGISTRY,fs:nodeFs(resolve(root,'public/assets')),
  palette:{colors:PALETTE,status:PALETTE_STATUS,maxColors:MAX_PALETTE_COLORS},gameData:{parts:PARTS,chassis:CHASSIS_LIST,roads:ROADS},
  mode:'production',phase:'proof_c',...(existsSync(gpl)?{gpl:{expected:renderGpl(),actual:readFileSync(gpl,'utf8')}}:{})});
const extraErrors:string[]=[],measurements:unknown[]=[];
for(const id of ids) {
  const asset=ASSET_REGISTRY.find(a=>a.id===id)!;
  const bytes=readFileSync(resolve(root,'public/assets',runtimeFiles(asset)[0]!));
  const p=readPng(bytes),grid=JSON.parse(readFileSync(resolve(here,'pixels',id+'.json'),'utf8')) as PixelGrid;
  if(!Buffer.from(bytes).equals(png(raster(grid)))) extraErrors.push(`${id}: runtime differs from maintained pixel source`);
  if(asset.tileX) for(let y=0;y<p.height;y++) if(get(p,0,y).join(',')!==get(p,p.width-1,y).join(',')) extraErrors.push(`${id}: mismatched horizontal edge at row ${y}`);
  if(id==='env_road_asphalt') for(let x=0;x<p.width;x++) if(get(p,x,0).join(',')!==get(p,0,0).join(',')) extraErrors.push('road: uneven contact rim');
  const colors=new Set<string>(),alpha=new Set<number>();
  for(let i=0;i<p.rgba.length;i+=4) {alpha.add(p.rgba[i+3]!);if(p.rgba[i+3]!==0) colors.add([...p.rgba.subarray(i,i+3)].join(','));}
  measurements.push({id,width:p.width,height:p.height,visibleColors:colors.size,alpha:[...alpha].sort((a,b)=>a-b),sha256:createHash('sha256').update(bytes).digest('hex')});
}
const runAssets=report.assets.filter(a=>ids.includes(a.assetId));
// Only these two exact presence failures belong to the untouched Garage batch. Any global,
// palette, file-hygiene or other asset error still fails Run acceptance.
const remainingErrors=report.issues.filter(i=>i.severity==='error'&&!(i.code==='missing-required'&&['env_garage_wall','env_garage_lift'].includes(i.assetId??'')));
const runPassed=runAssets.length===6&&runAssets.every(a=>a.result==='passed')&&remainingErrors.length===0&&extraErrors.length===0;
const evidence={scope:'ART-03R Run technical checks; owner visual approval recorded separately; no in-game/final approval',runPassed,runAssets,measurements,extraErrors,
  proofC:{passed:report.ok,errors:report.errorCount,warnings:report.warningCount,issues:report.issues.filter(i=>i.severity==='error')},
  fullRegistrySummary:report.summary};
writeFileSync(resolve(here,'validation.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
process.exitCode=runPassed?0:1;

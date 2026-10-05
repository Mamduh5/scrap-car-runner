/** Export maintained explicit pixels and production-scale review images. Never touches Garage. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ASSET_BY_ID,expectedFileSize,runtimeFiles} from '../../../../src/game/assets/assetRegistry.ts';
import {PALETTE,hexToRgb} from '../../../../src/game/assets/palette.ts';
import {raster,png,readPng,empty,pixel,get,blit,crop,scaled,type PixelGrid,type Raster} from './pixels.ts';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
export const RUN_IDS=['env_sky_outskirts','env_clouds_strip','env_far_junkyard','env_road_asphalt','prop_scrap_pile_a','fx_puff'] as const;
const images=new Map<string,Raster>();
function save(file:string,p:Raster):void {mkdirSync(dirname(file),{recursive:true});writeFileSync(file,png(p));}
for(const id of RUN_IDS) {
  const grid=JSON.parse(readFileSync(resolve(here,'pixels',id+'.json'),'utf8')) as PixelGrid;
  const asset=ASSET_BY_ID.get(id)!,size=expectedFileSize(asset)!;
  if(grid.id!==id||grid.width!==size.w||grid.height!==size.h) throw new Error(id+': source does not match registry');
  const p=raster(grid);images.set(id,p);
  const file=resolve(root,'public/assets',runtimeFiles(asset)[0]!);
  const bytes=png(p);
  if(existsSync(file)&&readFileSync(file).equals(bytes)) console.log(`retain ${runtimeFiles(asset)[0]} (byte-identical)`);
  else {
    if(id!=='env_clouds_strip') throw new Error(id+': cloud correction must not change KEEP exports');
    save(file,p);console.log(`export ${runtimeFiles(asset)[0]} ${p.width}x${p.height}`);
  }
}
const load=(file:string)=>readPng(readFileSync(resolve(root,'public/assets',file)));
const body=load('vehicles/veh_rustbucket_body.png'),engine=load('vehicles/veh_rustbucket_ov_engine_t1.png'),wheels=load('vehicles/veh_wheel_tires_t1.png');
const sky=images.get('env_sky_outskirts')!,clouds=images.get('env_clouds_strip')!,far=images.get('env_far_junkyard')!,road=images.get('env_road_asphalt')!,prop=images.get('prop_scrap_pile_a')!,puff=images.get('fx_puff')!;
const preview=resolve(here,'preview');
function composite(w:number,h:number,scroll=0,frame=0,backgroundOnly=false,cloudPhase=0):Raster {
  const p=empty(w,h),ground=h-48;
  // Registered sky has 300 rows: anchor its pale horizon to the road, clamp only its top bleed.
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) pixel(p,x,y,get(sky,x%16,Math.max(0,Math.min(299,y-ground+300))));
  // Review-only offsets; no production gameplay rates.
  const cloudOffset=(cloudPhase+Math.floor(scroll/3))%clouds.width;
  for(let x=-clouds.width-cloudOffset;x<w;x+=clouds.width) blit(p,clouds,x,ground-156);
  for(let x=-256-scroll%256;x<w;x+=256) blit(p,far,x,ground-96);
  if(backgroundOnly) return p;
  for(let x=-64-scroll%64;x<w;x+=64) blit(p,road,x,ground);
  // Shared ART-01 registration: centers (26,44)/(86,44), bottom visible tread y54.
  const cx=Math.floor((w-112)/2),cy=ground-55;
  blit(p,prop,w-51,ground-31); // reference-like roadside dressing, outside the hero on wider panels
  blit(p,body,cx,cy);blit(p,engine,cx,cy);
  for(const wx of [26,86]) blit(p,crop(wheels,frame*24,0,24,24),cx+wx-12,cy+44-12);
  blit(p,crop(puff,frame*16,0,16,16),Math.max(0,cx-13),ground-17,hexToRgb(PALETTE.dust_3));
  return p;
}
save(resolve(preview,'background_layers_1x.png'),composite(768,288,0,0,true));
save(resolve(preview,'background_layers_3x.png'),scaled(composite(768,288,0,0,true),3));
save(resolve(preview,'background_216_1x.png'),composite(216,288,0,0,true));
const cloudRepeat=empty(768,128);
for(let y=0;y<cloudRepeat.height;y++) for(let x=0;x<cloudRepeat.width;x++) pixel(cloudRepeat,x,y,get(sky,x%16,y+105));
for(let x=0;x<cloudRepeat.width;x+=clouds.width) blit(cloudRepeat,clouds,x,16);
save(resolve(preview,'cloud_tile_repeat_1x.png'),cloudRepeat);
save(resolve(preview,'cloud_tile_repeat_4x.png'),scaled(cloudRepeat,4));
save(resolve(preview,'run_1x.png'),composite(180,288));
save(resolve(preview,'run_4x.png'),scaled(composite(180,288),4));
save(resolve(preview,'run_max_1x.png'),composite(216,427));
save(resolve(preview,'run_216_1x.png'),composite(216,288));
save(resolve(preview,'run_216_4x.png'),scaled(composite(216,288),4));
save(resolve(preview,'run_wide_1x.png'),composite(768,288));
save(resolve(preview,'run_wide_3x.png'),scaled(composite(768,288),3));
// All parallax regions, three wrap positions and all wheel/puff frames at actual art scale.
const strip=empty(216*4,288);
for(let i=0;i<4;i++) blit(strip,composite(216,288,i*61,i,false,[0,104,240,348][i]!),i*216,0);
save(resolve(preview,'run_scroll_contact_1x.png'),strip);
save(resolve(preview,'run_scroll_contact_3x.png'),scaled(strip,3));
const contact=empty(320,180);
for(let y=0;y<180;y++) for(let x=0;x<320;x++) pixel(contact,x,y,[...hexToRgb(PALETTE.sky_outskirts_2),255]);
blit(contact,far,0,0);blit(contact,road,0,104);blit(contact,prop,80,104);blit(contact,puff,140,112);
save(resolve(preview,'asset_contact_1x.png'),contact);
save(resolve(preview,'asset_contact_4x.png'),scaled(contact,4));
console.log('Review PNGs exported from actual runtime files; no Phaser/in-game approval claimed.');

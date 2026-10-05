/**
 * Retained initial translation recipe: raster masters -> explicit editable pixel grids.
 * Run only to retranslate masters; build.ts exports the maintained pixel grids instead.
 * No random texture or shape generation. Crops, material palettes and local repairs are explicit.
 */
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { PALETTE,hexToRgb,type PaletteName } from '../../../../src/game/assets/palette.ts';
import { readPng,empty,get,pixel,blit,gridOf,type Raster } from './pixels.ts';
import { drawSky } from './sky.ts';
const here=new URL('./',import.meta.url);
mkdirSync(new URL('pixels/',here),{recursive:true});
const load=(name:string)=>readPng(readFileSync(new URL(`masters/${name}.png`,here)));
const rgb=(name:PaletteName)=>[...hexToRgb(PALETTE[name]),255];
const nearest=(c:readonly number[],names:readonly PaletteName[])=>{
  let best=names[0]!,distance=Infinity;
  for(const name of names) {
    const v=hexToRgb(PALETTE[name]);
    const d=2*(v[0]-c[0]!)**2+3*(v[1]-c[1]!)**2+(v[2]-c[2]!)**2;
    if(d<distance) {best=name;distance=d;}
  }
  return rgb(best);
};
/** Nine sub-samples within each destination cell; no filtering in final runtime images. */
function trace(src:Raster,box:readonly[number,number,number,number],w:number,h:number,names:readonly PaletteName[],cutout=false,farValues=false):Raster {
  const out=empty(w,h);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const sum=[0,0,0];let n=0;
    for(const sy of [.2,.5,.8]) for(const sx of [.2,.5,.8]) {
      const c=get(src,Math.min(src.width-1,Math.floor(box[0]+(x+sx)*box[2]/w)),Math.min(src.height-1,Math.floor(box[1]+(y+sy)*box[3]/h)));
      if(cutout&&c[3]!<200) continue;
      for(let k=0;k<3;k++) sum[k]=sum[k]!+c[k]!;
      n++;
    }
    if(n<(cutout?5:1)) continue;
    const avg=sum.map(v=>v/n);
    if(farValues) {
      const v=(avg[0]!+avg[1]!+avg[2]!)/3;
      pixel(out,x,y,rgb(v<115?'steel_2':v<145?'steel_3':v<190?'sky_outskirts_1':'sky_outskirts_2'));
    } else pixel(out,x,y,nearest(avg,names));
  }
  return out;
}
function save(id:string,p:Raster):void {
  writeFileSync(new URL(`pixels/${id}.json`,here),JSON.stringify(gridOf(id,p),null,2)+'\n');
}

// The owner-authorized sky-only RGB ramp is defined by skyRamp.ts; no sky master is sampled.
save('env_sky_outskirts',drawSky());

const far=trace(load('far'),[0,0,2048,768],256,96,['steel_2','steel_3','sky_outskirts_1','sky_outskirts_2'],true,true);
// Tile joins share a short low horizon shoulder, not a duplicated building or a hard vertical edge.
for(let y=0;y<96;y++) {
  const edge=y<70?[0,0,0,0]:rgb(y<84?'steel_3':'steel_2');
  pixel(far,0,y,edge);pixel(far,255,y,edge);
  if(y<70) {pixel(far,1,y,[0,0,0,0]);pixel(far,254,y,[0,0,0,0]);}
}
save('env_far_junkyard',far);

// Select a narrower, reference-like material section so stones retain 3..5px silhouettes.
// Active master was cropped by 302 unused top rows. The sampled road pixels are identical.
const road=trace(load('road'),[300,0,850,640],64,48,['ink_1','ink_2','steel_0','steel_1','steel_2','dust_0','dust_1','dust_2','dust_3','rust_0']);
// Local cluster cleanup on soil only. Stone shades and cap are preserved; isolated soil speckle
// is replaced by the dominant neighboring soil value, never by random texture.
const soil=new Set(['dust_0','dust_1','dust_2','rust_0','ink_2'].map(c=>rgb(c as PaletteName).join(',')));
for(let pass=0;pass<2;pass++) {
  const src={...road,rgba:road.rgba.slice()};
  for(let y=10;y<47;y++) for(let x=1;x<63;x++) {
    const c=get(src,x,y),key=c.join(',');if(!soil.has(key)) continue;
    const counts=new Map<string,{color:number[];n:number}>();
    for(let yy=-1;yy<=1;yy++) for(let xx=-1;xx<=1;xx++) {
      const v=get(src,x+xx,y+yy),k=v.join(',');if(!soil.has(k)) continue;
      const entry=counts.get(k)??{color:v,n:0};entry.n++;counts.set(k,entry);
    }
    const dominant=[...counts.values()].sort((a,b)=>b.n-a.n)[0];
    if((counts.get(key)?.n??0)<=2&&dominant&&dominant.n>=4) pixel(road,x,y,dominant.color);
  }
}
// Explicit wheel-contact repairs: uninterrupted level rim; asphalt has chipped underside at y5..7.
for(let x=0;x<64;x++) {pixel(road,x,0,rgb('steel_2'));pixel(road,x,1,rgb('steel_0'));}
// Reduce the excessive master fissures to one sparse hairline and one short repair patch.
for(const [x,y] of [[17,2],[18,3],[18,4],[19,5]] as const) pixel(road,x,y,rgb('ink_2'));
for(let x=42;x<=47;x++) pixel(road,x,3,rgb('steel_1'));
for(let x=44;x<=48;x++) pixel(road,x,4,rgb('steel_0'));
// Match both edge columns from an interior material profile, preserve internal stone/soil shapes.
for(let y=2;y<48;y++) {const c=get(road,2,y);pixel(road,0,y,c);pixel(road,63,y,c);}
save('env_road_asphalt',road);

const prop=empty(48,32);
blit(prop,trace(load('prop'),[12,147,1512,779],46,24,['ink_0','ink_1','ink_2','steel_0','steel_1','steel_2','steel_3','rust_0','rust_1','rust_2','rust_3','rust_4','dust_0','dust_1','dust_2','dust_3'],true),1,7);
// Preserve gearbox hub at this reduced scale: shaded bore surrounded by a warm worn rim.
pixel(prop,33,23,rgb('ink_0'));pixel(prop,34,23,rgb('ink_1'));pixel(prop,33,22,rgb('rust_3'));
save('prop_scrap_pile_a',prop);

// Four individual crop regions preserve the master's increasing volumes on equal 16x16 frames.
const puffMaster=load('puff'),puff=empty(64,16);
const boxes:readonly (readonly[number,number,number,number])[]=[[30,155,515,515],[522,155,515,515],[1015,155,515,515],[1630,155,515,515]];
boxes.forEach((box,f)=>{
  for(let y=1;y<15;y++) for(let x=1;x<15;x++) {
    const c=get(puffMaster,Math.floor(box[0]+(x-.5)*box[2]/14),Math.floor(box[1]+(y-.5)*box[3]/14));
    if(c[3]!<200) continue;
    const v=Math.round((c[0]!+c[1]!+c[2]!)/3/48)*48;
    const shade=Math.max(96,Math.min(240,v));
    pixel(puff,f*16+x,y,[shade,shade,shade,f===3?153:255]);
  }
});
save('fx_puff',puff);
console.log('Five explicit pixel-grid sources written. Inspect and maintain those before export.');

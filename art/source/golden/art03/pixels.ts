/** Editable, explicit pixel grids. Exporting never regenerates artwork from geometry or randomness. */
import { PALETTE, hexToRgb, type PaletteName } from '../../../../src/game/assets/palette.ts';
import { encodePng, decodePng } from '../../../../tools/assets/png.ts';

export interface PixelGrid {
  id: string;
  width: number;
  height: number;
  /** Palette name, grayscale effect byte, or authorized sky RGB hex. '.' is transparent. */
  colors: Record<string, PaletteName | number | `#${string}`>;
  rows: string[];
  /** Optional alpha rows: symbols 0..F encode multiples of 17, preserving crisp stepped opacity. */
  alpha?: string[];
}
export interface Raster { width: number; height: number; rgba: Uint8Array }
export function raster(grid: PixelGrid): Raster {
  if (grid.rows.length !== grid.height || grid.rows.some(row => row.length !== grid.width)) throw new Error(`${grid.id}: invalid pixel grid`);
  if (grid.alpha && (grid.alpha.length !== grid.height || grid.alpha.some(row => row.length !== grid.width || !/^[0-9A-F]+$/.test(row)))) throw new Error(`${grid.id}: invalid alpha grid`);
  const rgba = new Uint8Array(grid.width * grid.height * 4);
  grid.rows.forEach((row,y) => [...row].forEach((symbol,x) => {
    if (symbol === '.') return;
    const color = grid.colors[symbol];
    if (color === undefined) throw new Error(`${grid.id}: unknown symbol ${symbol}`);
    if (typeof color === 'number' && (!Number.isInteger(color) || color < 0 || color > 255)) throw new Error('invalid grayscale');
    if (typeof color === 'string' && color.startsWith('#') && grid.id !== 'env_sky_outskirts') throw new Error('RGB literals are restricted to the authorized sky source');
    const rgb = typeof color === 'number' ? [color,color,color] : hexToRgb(color.startsWith('#') ? color : PALETTE[color as PaletteName]);
    const i = (y*grid.width+x)*4;
    rgba.set(rgb,i); rgba[i+3] = grid.alpha ? parseInt(grid.alpha[y]![x]!,16)*17 : 255;
  }));
  return { width:grid.width, height:grid.height, rgba };
}
export function png(p: Raster): Buffer { return encodePng(p.width,p.height,p.rgba); }
export function readPng(bytes: Uint8Array): Raster { return decodePng(bytes); }
export function empty(width: number,height: number): Raster { return {width,height,rgba:new Uint8Array(width*height*4)}; }
export function pixel(p: Raster,x: number,y: number,rgba: readonly number[]): void {
  if (x>=0 && y>=0 && x<p.width && y<p.height) p.rgba.set(rgba,(y*p.width+x)*4);
}
export function get(p: Raster,x: number,y: number): number[] { return [...p.rgba.subarray((y*p.width+x)*4,(y*p.width+x)*4+4)]; }
export function crop(p: Raster,x: number,y: number,width: number,height: number): Raster {
  const out=empty(width,height);
  for(let yy=0;yy<height;yy++) for(let xx=0;xx<width;xx++) pixel(out,xx,yy,get(p,x+xx,y+yy));
  return out;
}
export function scaled(p: Raster,scale: number): Raster {
  const out=empty(p.width*scale,p.height*scale);
  for(let y=0;y<out.height;y++) for(let x=0;x<out.width;x++) pixel(out,x,y,get(p,Math.floor(x/scale),Math.floor(y/scale)));
  return out;
}
export function blit(dst: Raster,src: Raster,ox: number,oy: number,tint?: readonly number[]): void {
  for(let y=0;y<src.height;y++) for(let x=0;x<src.width;x++) {
    const dx=x+ox,dy=y+oy;
    if(dx<0||dy<0||dx>=dst.width||dy>=dst.height) continue;
    const c=get(src,x,y), a=c[3]!/255;
    if(a===0) continue;
    const b=get(dst,dx,dy);
    pixel(dst,dx,dy,[0,1,2].map(k=>Math.round(c[k]!*(tint ? tint[k]!/255 : 1)*a+b[k]!*(1-a))).concat(255));
  }
}
export function gridOf(id: string,p: Raster): PixelGrid {
  const symbols='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const colors: PixelGrid['colors']={}, lookup=new Map<string,string>();
  const canonical=new Map(Object.entries(PALETTE).map(([name,hex])=>[hexToRgb(hex).join(','),name as PaletteName]));
  const rows:string[]=[], alpha:string[]=[];
  let soft=false;
  for(let y=0;y<p.height;y++) {
    let row='',opacity='';
    for(let x=0;x<p.width;x++) {
      const c=get(p,x,y),a=c[3]!;
      if(a!==0&&a!==255) soft=true;
      opacity+=Math.round(a/17).toString(16).toUpperCase();
      if(a===0) {row+='.';continue;}
      const key=c.slice(0,3).join(',');
      let symbol=lookup.get(key);
      if(!symbol) {
        symbol=symbols[lookup.size] ?? (id==='env_sky_outskirts' ? String.fromCharCode(0x100+lookup.size) : undefined); if(!symbol) throw new Error('pixel source exceeds 64 colors');
        const name=canonical.get(key);
        if(name) colors[symbol]=name;
        else if(id==='env_sky_outskirts') colors[symbol]=('#'+c.slice(0,3).map(v=>v.toString(16).padStart(2,'0')).join('')) as `#${string}`;
        else if(c[0]===c[1]&&c[1]===c[2]) colors[symbol]=c[0]!;
        else throw new Error(`${id}: off-palette source ${key}`);
        lookup.set(key,symbol);
      }
      row+=symbol;
    }
    rows.push(row);alpha.push(opacity);
  }
  return {id,width:p.width,height:p.height,colors,rows,...(soft?{alpha}:{})};
}

/** Crop only unused source padding. Runtime pixel sources/exports are never written here. */
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {readPng,crop,png} from './pixels.ts';
const file=new URL('masters/road.png',import.meta.url);
const source=readPng(readFileSync(file));
if(source.width===1448&&source.height===784) {
  console.log('Active road master already cropped; no change.');
} else {
  if(source.width!==1448||source.height!==1086) throw new Error('Unexpected road master dimensions; crop was not applied.');
  // translate.ts uses original y=302..941. All retained sampling pixels move by exactly -302.
  const clean=crop(source,0,302,1448,784);
  const used=source.rgba.subarray(302*1448*4);
  if(!Buffer.from(clean.rgba).equals(Buffer.from(used))) throw new Error('Crop changed retained source pixels.');
  const rawDir=new URL('masters/raw/',import.meta.url),raw=new URL('road.png',rawDir);
  mkdirSync(rawDir,{recursive:true});
  if(existsSync(raw)&&!readFileSync(raw).equals(readFileSync(file))) throw new Error('Existing archived raw master differs.');
  if(!existsSync(raw)) copyFileSync(file,raw);
  writeFileSync(file,png(clean));
  console.log('Active road master 1448x1086 -> 1448x784; removed 302 unused top rows. Original generation archived; retained pixels identical.');
}

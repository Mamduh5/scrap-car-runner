/** Review-only assembly. Never draws or rewrites production pixels. */
import { readFileSync,writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { empty,readPng,png,get,pixel,crop,blit,scaled,type Raster } from '../art03/pixels.ts';
const here=resolve('art/source/golden/art03-garage'),out=resolve(here,'review');
const load=(p:string)=>readPng(readFileSync(p));
const wallBytes=readFileSync('public/assets/environments/env_garage_wall.png'),liftBytes=readFileSync('public/assets/environments/env_garage_lift.png');
const wall=readPng(wallBytes),lift=readPng(liftBytes);
writeFileSync(resolve(out,'wall-candidate.png'),wallBytes);writeFileSync(resolve(out,'lift-candidate.png'),liftBytes);
const body=load('public/assets/vehicles/veh_rustbucket_body.png'), wheels=load('public/assets/vehicles/veh_wheel_tires_t1.png');
function car(tier:number,frame:number):Raster {
 const p=empty(112,56);blit(p,body,0,0);blit(p,load(`public/assets/vehicles/veh_rustbucket_ov_engine_t${tier}.png`),0,0);
 for(const x of [14,74])blit(p,crop(wheels,frame*24,0,24,24),x,32);
 return p;
}
function compose(tier:number,frame:number):Raster {const p=crop(wall,0,0,216,427);blit(p,lift,40,281);blit(p,car(tier,frame),52,227);return p;}
function rect(p:Raster,x:number,y:number,w:number,h:number,c:number[]) {for(let xx=x;xx<x+w;xx++){pixel(p,xx,y,c);pixel(p,xx,y+h-1,c);}for(let yy=y;yy<y+h;yy++){pixel(p,x,yy,c);pixel(p,x+w-1,yy,c);}}
const clean=compose(1,0),guided=crop(clean,0,0,216,427);
rect(guided,18,69,180,288,[255,231,132,255]);rect(guided,52,227,112,56,[110,189,178,255]);rect(guided,40,281,136,20,[224,58,40,255]);
for(const cx of [78,138])for(let d=-3;d<=3;d++){pixel(guided,cx+d,271,[224,58,40,255]);pixel(guided,cx,271+d,[224,58,40,255]);}
for(const [x,y,w,h]of [[24,75,48,14],[180,75,12,14],[66,311,84,12],[24,333,168,18]])rect(guided,x!,y!,w!,h!,[111,180,245,255]);
for(const [name,p]of [['clean-216x427',clean],['guided-216x427',guided],['clean-180x288',crop(clean,18,69,180,288)],['guided-180x288',crop(guided,18,69,180,288)]]as const){writeFileSync(resolve(out,name+'.png'),png(p));writeFileSync(resolve(out,name+'-3x.png'),png(scaled(p,3)));}
const contact=empty(3*180,4*84),results=[];
for(let tier=1;tier<=3;tier++)for(let frame=0;frame<4;frame++) {
 const p=compose(tier,frame),vehicle=car(tier,frame);blit(contact,crop(p,18,221,180,84),(tier-1)*180,frame*84);
 let visible=0,mismatch=0;for(let y=0;y<56;y++)for(let x=0;x<112;x++)if(get(vehicle,x,y)[3]){visible++;if(get(vehicle,x,y).join()!==get(p,x+52,y+227).join())mismatch++;}
 if(mismatch)throw Error('Vehicle changed in review');
 const contacts=[26,86].map(cx=>{
  const pixels=[];for(let x=cx-12;x<cx+12;x++)for(let y=54;y<56;y++)if(get(vehicle,x,y)[3]&&get(lift,x+12,y-54)[3])pixels.push([x+52,y+227]);
  return {center:[cx+52,271],contactPixels:pixels};
 });
 if(contacts.some(v=>!v.contactPixels.length))throw Error('Wheel does not touch roller');
 results.push({engineTier:tier,wheelFrame:frame,visiblePixels:visible,mismatch,contacts});
}
writeFileSync(resolve(out,'engine-wheel-contact.png'),png(contact));
writeFileSync(resolve(out,'lift-6x.png'),png(scaled(lift,6)));
writeFileSync(resolve(here,'composition-validation.json'),JSON.stringify({canvas:[216,427],safe:[18,69,180,288],carOrigin:[52,227],liftOrigin:[40,281],wheelCenters:[[78,271],[138,271]],results,noRuntimeFxIncluded:true,uiReservations:'Guides only; not final layout or touch targets; no runtime implementation'},null,2)+'\n');
console.log('Review complete: 12 engine/wheel combinations, zero vehicle mismatches, contact verified.');

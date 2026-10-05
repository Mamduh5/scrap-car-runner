/** Calm reference-led atmosphere. Ordinary builds retain the editable pixel grid. */
import {outskirtsSkyRow} from '../../../../src/game/assets/skyRamp.ts';
import {empty,pixel,type Raster} from './pixels.ts';
export function drawSky():Raster {
  const out=empty(16,300);
  for(let y=0;y<300;y++) for(let x=0;x<16;x++) pixel(out,x,y,[...outskirtsSkyRow(y),255]);
  return out;
}

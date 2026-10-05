/** Owner-authorized ART-03R sky-only RGB ramp (2026-10-05).
 * Mean anchors from sky_base_reference.png; separate from the object/UI palette.
 */
export const OUTSKIRTS_SKY_ANCHORS = [
  {at:0, rgb:[64,193,252]}, {at:.25, rgb:[68,195,253]},
  {at:.5, rgb:[95,209,253]}, {at:.75, rgb:[155,235,246]},
  {at:1, rgb:[241,251,222]},
] as const;
export function outskirtsSkyRow(y:number): readonly [number,number,number] {
  const t=Math.max(0,Math.min(299,y))/299;
  const index=Math.min(3,Math.floor(t*4));
  const a=OUTSKIRTS_SKY_ANCHORS[index]!,b=OUTSKIRTS_SKY_ANCHORS[index+1]!;
  const f=(t-a.at)/(b.at-a.at);
  return [0,1,2].map(k=>Math.round(a.rgb[k]!+(b.rgb[k]!-a.rgb[k]!)*f)) as [number,number,number];
}

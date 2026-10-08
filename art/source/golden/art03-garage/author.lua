-- First Garage production pass. Deliberate native-pixel tracing via Aseprite Lua.
-- No source image resampling/quantization occurs here. Reference coordinates are
-- measured in the selected 180x218 core, translated by (18,104).
-- Rerunning deliberately reauthors masters; normal export MUST use the .aseprite files.
local dir=assert(app.params.out,'--script-param out=<source directory> required')
local P=dofile(dir..'/palette.lua')
local function c(name) local v=assert(P[name],name); return app.pixelColor.rgba(v[1],v[2],v[3],255) end
local spr,im,layer
local ox,oy=18,104
local function start(w,h)
  spr=Sprite(w,h,ColorMode.RGB)
  local pal=Palette(64); local names={};for n in pairs(P)do names[#names+1]=n end;table.sort(names)
  for i,n in ipairs(names)do pal:setColor(i-1,Color{r=P[n][1],g=P[n][2],b=P[n][3],a=255})end
  spr:setPalette(pal)
end
local function begin(name)
  if not layer then layer=spr.layers[1] else layer=spr:newLayer() end
  layer.name=name;im=Image(spr.width,spr.height,ColorMode.RGB)
end
local function finish()spr:newCel(layer,1,im,Point(0,0))end
local function dot(x,y,name)
  x=x+ox;y=y+oy
  if x>=0 and y>=0 and x<im.width and y<im.height then im:drawPixel(x,y,c(name))end
end
local function rect(x,y,w,h,name)for yy=y,y+h-1 do for xx=x,x+w-1 do dot(xx,yy,name)end end end
local function line(x0,y0,x1,y1,name,width)
 local dx,dy=math.abs(x1-x0),-math.abs(y1-y0);local sx=x0<x1 and 1 or -1;local sy=y0<y1 and 1 or -1;local e=dx+dy
 while true do rect(x0,y0,width or 1,width or 1,name);if x0==x1 and y0==y1 then break end;local e2=2*e;if e2>=dy then e=e+dy;x0=x0+sx end;if e2<=dx then e=e+dx;y0=y0+sy end end
end
local function poly(points,name)
 local low,high=10000,-10000
 for _,p in ipairs(points)do low=math.min(low,p[2]);high=math.max(high,p[2])end
 for y=low,high do
  local cuts={}
  for i,a in ipairs(points)do local b=points[i%#points+1];if (a[2]<=y and b[2]>y)or(b[2]<=y and a[2]>y)then cuts[#cuts+1]=a[1]+(y-a[2])*(b[1]-a[1])/(b[2]-a[2])end end
  table.sort(cuts);for i=1,#cuts-1,2 do for x=math.ceil(cuts[i]),math.floor(cuts[i+1])do dot(x,y,name)end end
 end
end
start(216,427)
begin('01 Sky - canonical stepped atmosphere')
rect(-18,-104,216,427,'sky_outskirts_0')
-- Two broad irregular value changes; no faux gradient, dither or repeated row.
poly({{-18,38},{28,39},{69,42},{108,43},{154,46},{198,47},{198,150},{-18,150}},'sky_outskirts_1')
poly({{-18,111},{19,110},{43,113},{79,115},{123,113},{165,116},{198,115},{198,177},{-18,177}},'sky_outskirts_2')
-- One restrained distant cloud bank from the selected left horizon.
poly({{-18,114},{-8,114},{-8,111},{1,111},{1,108},{5,108},{5,105},{9,105},{9,102},{13,102},{13,104},{17,104},{17,110},{23,110},{23,108},{26,108},{26,111},{32,111},{32,113},{38,113},{38,115},{-18,115}},'sky_outskirts_3')
rect(-4,114,21,2,'sky_outskirts_2');rect(18,115,16,1,'sky_outskirts_2')
finish()
begin('02 Distant junkyard - low contrast silhouettes')
poly({{-18,134},{-10,131},{-5,132},{-5,129},{2,129},{2,124},{8,123},{8,120},{16,118},{22,116},{26,117},{26,119},{33,119},{33,122},{38,122},{41,125},{41,130},{48,130},{48,128},{55,129},{55,132},{61,132},{61,137},{73,136},{79,132},{87,133},{87,138},{103,139},{113,134},{121,133},{124,136},{139,135},{143,130},{149,130},{151,126},{156,123},{165,122},{170,118},{175,119},{175,122},{180,122},{184,127},{194,128},{198,131},{198,151},{-18,151}},'steel_3')
-- Salvage shelter skeleton, stepped girders rather than noisy generated texture.
line(-2,128,22,117,'steel_2',2);line(22,117,43,130,'steel_2',2)
rect(4,128,2,14,'steel_2');rect(17,124,3,16,'steel_2');rect(29,124,2,14,'steel_2');rect(39,131,3,11,'steel_2')
line(5,129,37,129,'steel_2');rect(11,132,5,8,'sky_outskirts_2');rect(23,130,5,9,'sky_outskirts_2')
poly({{-18,142},{-8,139},{-3,140},{4,138},{14,141},{21,139},{29,141},{38,139},{44,141},{52,138},{58,141},{65,139},{75,142},{84,140},{96,143},{108,140},{121,140},{134,138},{144,141},{157,137},{167,136},{177,139},{188,138},{198,140},{198,152},{-18,152}},'steel_2')
rect(151,127,6,3,'sky_outskirts_2');rect(164,124,6,2,'sky_outskirts_2');line(166,121,175,123,'steel_2',2)
rect(180,132,6,4,'steel_3');rect(74,137,4,2,'steel_3');rect(124,137,7,2,'steel_3')
finish()
begin('03 Rear fence - patched salvage panels')
-- Rear plane is continuous under the excluded car and exhaust regions.
rect(-18,148,216,34,'dust_0')
local boards={ {-18,144,15,38,'steel_1'}, {-3,144,15,38,'dust_0'}, {12,143,10,39,'steel_1'}, {22,142,14,40,'dust_0'}, {36,144,16,38,'dust_0'}, {52,147,13,35,'steel_1'}, {65,146,12,36,'dust_0'}, {77,148,18,34,'steel_1'}, {95,146,14,36,'dust_0'}, {109,147,12,35,'dust_0'}, {121,145,11,37,'steel_1'}, {132,146,13,36,'dust_0'}, {145,143,16,39,'dust_0'}, {161,144,16,38,'steel_1'}, {177,145,21,37,'dust_0'} }
for _,b in ipairs(boards)do rect(b[1],b[2],b[3],b[4],b[5]);rect(b[1],b[2],1,b[4],'steel_0');end
-- Sparse wear follows board boundaries; no random pixels.
rect(-5,145,2,20,'dust_1');rect(19,144,2,9,'dust_1');rect(33,145,2,21,'steel_0')
rect(43,146,4,2,'dust_1');rect(54,149,1,19,'steel_2');rect(72,147,2,12,'dust_1')
rect(105,147,2,13,'steel_0');rect(137,148,2,27,'steel_0');rect(154,145,2,16,'dust_1')
rect(174,146,2,28,'steel_0');rect(183,148,2,12,'dust_1')
rect(-18,177,216,5,'steel_0')
finish()
begin('04 Ground - continuous quiet apron')
rect(-18,178,216,145,'steel_0')
-- Shallow slab edge follows the selected perspective, staying peripheral.
poly({{-18,178},{20,178},{20,181},{8,184},{-5,184},{-5,189},{-18,189}},'dust_0')
poly({{161,178},{198,177},{198,231},{192,225},{190,218},{186,215},{184,207},{180,202},{178,194},{173,190}},'dust_0')
line(170,185,180,204,'ink_2');line(180,204,189,218,'ink_2');line(189,219,195,230,'ink_2')
line(-18,199,-6,199,'dust_0');line(-6,199,0,202,'dust_0');rect(-16,197,8,2,'dust_1')
-- Lower extension stays non-critical, low contrast and continuous, without a UI band.
line(-18,265,-5,267,'ink_2');line(-5,267,5,279,'ink_2');line(188,279,198,289,'ink_2')
rect(-9,202,8,1,'dust_0');rect(183,215,3,1,'dust_1')
finish()
begin('05 Canopy supports and underslung beams')
-- Only peripheral supports; the middle remains an outdoor opening.
poly({{-18,26},{-12,27},{-12,188},{-18,190}},'ink_2')
rect(-16,30,3,155,'dust_0');rect(-13,58,1,116,'steel_1')
poly({{-16,74},{18,39},{22,43},{-14,81}},'ink_2');line(-13,74,20,41,'dust_0',2)
poly({{192,48},{198,49},{198,184},{193,184}},'ink_2');rect(194,57,3,123,'dust_0')
poly({{173,57},{178,57},{198,81},{198,87}},'ink_2');line(180,61,197,80,'dust_0',2)
poly({{-18,38},{40,41},{83,45},{135,48},{198,54},{198,66},{133,60},{73,56},{21,52},{-18,49}},'ink_2')
poly({{-18,40},{42,43},{82,47},{140,50},{198,56},{198,60},{131,55},{75,52},{19,48},{-18,45}},'dust_0')
line(-18,46,198,62,'steel_0',2)
rect(5,45,9,2,'dust_1');rect(65,49,8,2,'dust_1');rect(105,52,12,2,'dust_1');rect(168,57,10,2,'dust_1')
finish()
begin('06 Patched canopy roof - traced silhouette')
-- Selected silhouette: broad irregular sheet pieces, two daylight gaps on right.
poly({{-18,11},{-3,14},{18,15},{18,16},{49,18},{67,20},{64,32},{62,36},{-18,31}},'ink_2')
poly({{-18,12},{-3,15},{18,16},{19,17},{51,19},{68,21},{64,30},{61,33},{-18,29}},'steel_1')
poly({{1,15},{20,16},{24,30},{9,29},{4,25}},'steel_0')
poly({{52,19},{67,20},{64,29},{57,30},{53,28}},'rust_1')
poly({{73,20},{92,20},{111,24},{139,27},{131,43},{130,46},{63,41},{68,29}},'ink_2')
poly({{74,20},{91,21},{112,24},{138,27},{129,43},{65,39}},'dust_0')
poly({{76,21},{91,22},{86,38},{67,37}},'steel_1')
poly({{102,23},{113,24},{109,30},{105,31},{103,40},{93,40}},'rust_1')
poly({{118,25},{138,28},{129,43},{108,41}},'steel_1')
poly({{154,29},{173,30},{198,33},{198,51},{142,47},{147,36}},'ink_2')
poly({{155,29},{175,31},{198,34},{198,49},{145,45}},'steel_1')
poly({{168,31},{180,32},{170,46},{161,46}},'steel_0')
poly({{184,33},{194,34},{189,49},{176,47}},'rust_1')
-- Roof edge seams, small dents and weather bites, selectively lit from above/right.
line(-18,12,17,16,'dust_1');line(27,17,48,18,'dust_1');line(75,20,88,21,'dust_1');line(116,25,135,27,'dust_1');line(158,29,174,31,'steel_2')
line(25,18,24,29,'steel_0');line(41,20,39,31,'steel_0');line(78,23,72,35,'steel_0')
line(120,28,114,39,'steel_0');line(162,32,156,42,'steel_0')
rect(6,21,2,2,'steel_2');rect(44,23,2,2,'steel_2');rect(83,26,2,2,'steel_2');rect(124,30,2,2,'steel_2');rect(160,34,2,2,'steel_2')
rect(31,29,5,1,'dust_0');rect(77,35,5,2,'dust_0');rect(117,39,6,1,'dust_0')
-- Rear narrow beam visible through gaps: preserves the open patched shelter cue.
line(136,30,155,33,'dust_0',2);line(134,45,148,46,'dust_0',2)
finish()
begin('07 Hanging work lamp - opaque palette clusters')
line(162,63,162,74,'ink_2');rect(161,64,3,1,'steel_1');rect(161,67,3,1,'steel_2');rect(161,70,3,1,'steel_1')
poly({{161,73},{164,73},{165,76},{169,78},{170,81},{153,81},{155,77},{159,76}},'ink_2')
poly({{160,75},{164,75},{165,77},{168,79},{156,79}},'steel_0')
line(165,77,168,79,'steel_1');rect(154,81,16,2,'dust_1');rect(157,81,10,1,'dust_3');rect(159,82,6,1,'dust_4')
-- No baked transparent glow, cone, flare or animated light.
line(170,83,177,89,'dust_0');line(177,89,184,93,'dust_0')
finish()
spr:saveAs(dir..'/env_garage_wall.aseprite')
spr:saveCopyAs(dir..'/review/wall-candidate.png')
-- Separate low roller assembly. 10 occupied rows in its registered 20px canvas.
layer=nil;ox=0;oy=0;start(136,20)
begin('01 Salvaged bridge and end braces')
poly({{1,2},{12,1},{20,2},{24,3},{51,3},{55,2},{80,2},{84,3},{113,3},{116,2},{124,1},{134,2},{135,9},{1,9}},'ink_1')
rect(2,4,132,5,'steel_0');rect(4,3,17,1,'steel_2');rect(115,3,17,1,'steel_2')
rect(52,4,31,4,'steel_1');rect(56,3,21,1,'steel_2');rect(60,5,15,1,'steel_0');rect(65,6,7,2,'ink_1')
rect(5,5,12,3,'steel_1');rect(118,5,12,3,'steel_1')
rect(2,8,15,2,'ink_2');rect(118,8,16,2,'ink_2');rect(53,8,29,2,'steel_0')
rect(8,3,3,1,'dust_2');rect(12,2,4,1,'yellow_0');rect(120,2,5,1,'yellow_0');rect(127,3,3,1,'dust_2')
rect(6,6,2,1,'steel_3');rect(17,5,2,1,'ink_1');rect(116,5,2,1,'ink_1');rect(129,6,2,1,'steel_3')
rect(56,5,1,1,'steel_3');rect(79,5,1,1,'steel_3');rect(50,8,3,1,'rust_1')
finish()
begin('02 Rollers - wheel centers x38 and x98')
for _,cx in ipairs({38,98})do
 -- Contact top spans the exact tread. Stepped curved profile and lateral end caps.
 rect(cx-12,1,24,7,'ink_1');rect(cx-10,0,20,1,'steel_2')
 rect(cx-11,1,22,1,'steel_3');rect(cx-11,2,22,2,'steel_1');rect(cx-11,4,22,2,'steel_0');rect(cx-10,6,20,1,'ink_2')
 rect(cx-15,2,4,6,'rust_0');rect(cx+11,2,4,6,'rust_0')
 rect(cx-14,1,2,1,'dust_1');rect(cx-14,2,2,4,'rust_2');rect(cx-14,6,2,2,'rust_1')
 rect(cx+12,1,2,1,'dust_1');rect(cx+12,2,2,4,'rust_2');rect(cx+12,6,2,2,'rust_1')
 rect(cx-12,2,1,3,'dust_2');rect(cx+11,2,1,3,'dust_2')
 rect(cx-9,3,17,1,'steel_2');rect(cx-8,4,7,1,'steel_1')
end
finish()
spr:saveAs(dir..'/env_garage_lift.aseprite')
spr:saveCopyAs(dir..'/review/lift-candidate.png')
print('Authored Garage masters and isolated candidates; no runtime export or lifecycle mutation.')

-- Review documents only; never exported to runtime paths.
local dir=assert(app.params.out);local root=assert(app.params.root)
local function img(p)return Image{fromFile=p}end
local function put(s,name,i,x,y,first)
 local l=first and s.layers[1] or s:newLayer();l.name=name;s:newCel(l,1,i,Point(x,y));return l
end
local function overlay(clean,guided)
 local o=Image(clean.width,clean.height,ColorMode.RGB)
 for y=0,clean.height-1 do for x=0,clean.width-1 do if clean:getPixel(x,y)~=guided:getPixel(x,y)then o:drawPixel(x,y,guided:getPixel(x,y))end end end
 return o
end
local prep=root..'/art/source/golden/art03-garage-concept/production-preparation'
local p=Sprite(216,427,ColorMode.RGB)
local base=img(prep..'/guides/mapping-216x427.png')
put(p,'REFERENCE ONLY - not production pixels',base,0,0,true)
put(p,'GUIDES - safe / car / lift / exclusions',overlay(base,img(prep..'/guides/guided-216x427.png')),0,0,false)
p:saveAs(prep..'/mapping-review.aseprite')
local s=Sprite(216,427,ColorMode.RGB)
put(s,'Wall candidate - external master',img(dir..'/review/wall-candidate.png'),0,0,true)
put(s,'Lift candidate - origin 40 281',img(dir..'/review/lift-candidate.png'),40,281,false)
local v=root..'/public/assets/vehicles/'
put(s,'Approved body - read-only review copy',img(v..'veh_rustbucket_body.png'),52,227,false)
put(s,'Approved engine T1 - read-only review copy',img(v..'veh_rustbucket_ov_engine_t1.png'),52,227,false)
local w=Image(img(v..'veh_wheel_tires_t1.png'),Rectangle(0,0,24,24))
put(s,'Approved rear wheel frame 0',w,66,259,false)
put(s,'Approved front wheel frame 0',w,126,259,false)
local guides=put(s,'GUIDES - hidden for clean review',overlay(img(dir..'/review/clean-216x427.png'),img(dir..'/review/guided-216x427.png')),0,0,false)
guides.isVisible=false
assert(Image(s):isEqual(img(dir..'/review/clean-216x427.png')),'Layered review does not match clean review')
s:saveAs(dir..'/review/composition.aseprite')
print('PASS: retained layered preparation and exact-car review documents; guide layers separate')

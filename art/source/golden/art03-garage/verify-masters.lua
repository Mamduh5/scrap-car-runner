local dir=assert(app.params.out)
local names={'env_garage_wall','env_garage_lift'}
local report={version=tostring(app.version),assets={}}
for _,name in ipairs(names)do
 local s=app.open(dir..'/'..name..'.aseprite')
 local exported=Image{fromFile=app.params.runtime..'/'..name..'.png'}
 assert(Image(s):isEqual(exported),'Master/export pixel mismatch: '..name)
 local layers={};for _,l in ipairs(s.layers)do layers[#layers+1]={name=l.name,visible=l.isVisible}end
 report.assets[#report.assets+1]={id=name,width=s.width,height=s.height,layers=layers,masterExportPixelMatch=true}
end
local f=assert(io.open(dir..'/master-validation.json','w'));f:write(json.encode(report));f:close()
print('PASS: reopened layered masters exactly match runtime exports')

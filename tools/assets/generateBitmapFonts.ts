import { createCanvas } from 'canvas';
import opentype from 'opentype.js';
import fs from 'fs';
import path from 'path';

// Fonts to process
const fonts = [
  {
    key: 'font_display',
    name: 'Silkscreen',
    source: 'art/source/fonts/silkscreen/Silkscreen-Regular.ttf',
    size: 16, // Base size 8 * 2 = 16. Covers 16, 24 (1.5x), 32 (2x), 48 (3x) well.
    padding: 2
  },
  {
    key: 'font_body',
    name: 'VT323',
    source: 'art/source/fonts/vt323/VT323-Regular.ttf',
    size: 16, // Critical body size. Covers 16 well. 24 is 1.5x, 12 is 0.75x.
    padding: 2
  }
];

const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !?.,:;'\"()[]+-/%=#$&".split('');

function generateFont(fontConfig) {
  console.log(`Generating ${fontConfig.key} from ${fontConfig.source} at size ${fontConfig.size}...`);
  
  const fontBuffer = fs.readFileSync(path.resolve(fontConfig.source));
  const font = opentype.parse(fontBuffer.buffer);
  
  const glyphs = [];
  let atlasWidth = 256;
  let atlasHeight = 256;
  
  let currentX = fontConfig.padding;
  let currentY = fontConfig.padding;
  let rowHeight = 0;
  
  // Opentype uses ascending/descending for line height
  const scale = 1 / font.unitsPerEm * fontConfig.size;
  const ascender = Math.ceil(font.ascender * scale);
  const descender = Math.ceil(Math.abs(font.descender * scale));
  const lineHeight = ascender + descender;
  
  for (const char of charSet) {
    const otGlyph = font.charToGlyph(char);
    const advanceWidth = Math.ceil(otGlyph.advanceWidth * scale);
    
    // Some glyphs have bounding boxes
    const boundingBox = otGlyph.getBoundingBox();
    const bbWidth = Math.ceil((boundingBox.x2 - boundingBox.x1) * scale);
    const width = Math.max(advanceWidth, bbWidth || 0);
    const height = lineHeight;
    
    if (currentX + width + fontConfig.padding > atlasWidth) {
      currentX = fontConfig.padding;
      currentY += rowHeight + fontConfig.padding;
      rowHeight = 0;
    }
    
    glyphs.push({
      char,
      otGlyph,
      id: char.charCodeAt(0),
      x: currentX,
      y: currentY,
      width: width,
      height: height,
      xoffset: 0,
      yoffset: 0, 
      xadvance: advanceWidth + 1 // Add 1px explicit kerning/spacing
    });
    
    currentX += width + fontConfig.padding;
    rowHeight = Math.max(rowHeight, height);
  }
  
  atlasHeight = currentY + rowHeight + fontConfig.padding;
  atlasHeight = Math.pow(2, Math.ceil(Math.log2(atlasHeight)));
  
  const canvas = createCanvas(atlasWidth, atlasHeight);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, atlasWidth, atlasHeight);
  
  for (const g of glyphs) {
    if (g.char !== ' ') {
      const path = g.otGlyph.getPath(g.x, g.y + ascender, fontConfig.size);
      path.fill = '#FFFFFF';
      path.draw(ctx);
    }
  }
  
  // Binarize alpha for crisp pixel rendering
  const imgData = ctx.getImageData(0, 0, atlasWidth, atlasHeight);
  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imgData.data[i + 3] > 127) { // 50% alpha threshold
      imgData.data[i + 0] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    } else {
      imgData.data[i + 3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  
  // Output Paths
  const outDir = path.resolve('public/assets/fonts');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const pngPath = path.join(outDir, `${fontConfig.key}.png`);
  const xmlPath = path.join(outDir, `${fontConfig.key}.xml`);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(pngPath, buffer);
  
  // XML
  let xml = `<?xml version="1.0"?>\n`;
  xml += `<font>\n`;
  xml += `  <info face="${fontConfig.key}" size="${fontConfig.size}" bold="0" italic="0" charset="" unicode="1" stretchH="100" smooth="0" aa="1" padding="0,0,0,0" spacing="${fontConfig.padding},${fontConfig.padding}" outline="0"/>\n`;
  xml += `  <common lineHeight="${lineHeight}" base="${ascender}" scaleW="${atlasWidth}" scaleH="${atlasHeight}" pages="1" packed="0"/>\n`;
  xml += `  <pages>\n`;
  xml += `    <page id="0" file="${fontConfig.key}.png"/>\n`;
  xml += `  </pages>\n`;
  xml += `  <chars count="${glyphs.length}">\n`;
  
  for (const g of glyphs) {
    xml += `    <char id="${g.id}" x="${g.x}" y="${g.y}" width="${g.width}" height="${g.height}" xoffset="${g.xoffset}" yoffset="${g.yoffset}" xadvance="${g.xadvance}" page="0" chnl="15"/>\n`;
  }
  
  xml += `  </chars>\n`;
  xml += `</font>\n`;
  
  fs.writeFileSync(xmlPath, xml);
  
  console.log(`Successfully generated ${fontConfig.key} (${atlasWidth}x${atlasHeight}, ${glyphs.length} glyphs)`);
}

for (const font of fonts) {
  generateFont(font);
}

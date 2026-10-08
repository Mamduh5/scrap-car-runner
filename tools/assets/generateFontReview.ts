import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

async function generateReview() {
  const outPath = path.resolve('art/source/fonts/font_review.png');
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#130E14'; // ink_0
  ctx.fillRect(0, 0, 600, 400);
  ctx.imageSmoothingEnabled = false;
  
  const drawBMText = async (key, text, startX, startY, color) => {
    const xml = fs.readFileSync(path.resolve(`public/assets/fonts/${key}.xml`), 'utf8');
    const chars = {};
    const regex = /<char id="(\d+)" x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)" xoffset="(\d+)" yoffset="(\d+)" xadvance="(\d+)"/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      chars[String.fromCharCode(match[1])] = {
        x: parseInt(match[2]), y: parseInt(match[3]), w: parseInt(match[4]), h: parseInt(match[5]),
        xoff: parseInt(match[6]), yoff: parseInt(match[7]), xadv: parseInt(match[8])
      };
    }
    
    const img = await loadImage(path.resolve(`public/assets/fonts/${key}.png`));
    
    // Create a temporary canvas to apply color tint
    const tintCanvas = createCanvas(img.width, img.height);
    const tCtx = tintCanvas.getContext('2d');
    tCtx.fillStyle = color;
    tCtx.fillRect(0, 0, img.width, img.height);
    tCtx.globalCompositeOperation = 'destination-in';
    tCtx.drawImage(img, 0, 0);
    
    let x = startX;
    for (const char of text) {
      const c = chars[char];
      if (c && c.w > 0) {
        ctx.drawImage(tintCanvas, c.x, c.y, c.w, c.h, x + c.xoff, startY + c.yoff, c.w, c.h);
      }
      x += c ? c.xadv : 8;
    }
  };
  
  // DISPLAY (font_display - Silkscreen)
  await drawBMText('font_display', 'GARAGE', 20, 20, '#565C6E'); // steel_4
  await drawBMText('font_display', '1,240 M', 20, 50, '#565C6E'); // steel_4
  await drawBMText('font_display', 'SCAVENGE', 20, 80, '#F5C535'); // yellow_2
  
  // BODY (font_body - VT323)
  await drawBMText('font_body', 'Rusty V8 Engine', 20, 120, '#F5C535'); // titlecase body
  await drawBMText('font_body', 'Cooling remaining: 45% / 100%', 20, 150, '#9A9CA5'); // steel_3
  await drawBMText('font_body', 'Caution: Heat Rising!', 20, 180, '#E85A3F'); // heat_1
  await drawBMText('font_body', 'This is a description of a part. It wraps.', 20, 210, '#565C6E'); // steel_4
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated review evidence at ${outPath}`);
}

generateReview();

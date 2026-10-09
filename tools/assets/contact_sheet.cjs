const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const reviewDir = 'd:/Mamduh/Personal/scrap-car-runner/art/source/golden/art02b/production-review';

(async () => {
  const run = await loadImage(path.join(reviewDir, 'proof_c_run.png'));
  const gar = await loadImage(path.join(reviewDir, 'proof_d_garage.png'));
  const slots = await loadImage(path.join(reviewDir, 'proof_b_five_family.png'));
  const icons = await loadImage(path.join(reviewDir, 'proof_e_icons.png'));

  // Create a clean 420x720 2x2 layout
  const canvas = createCanvas(420, 720);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#1a1c2c';
  ctx.fillRect(0, 0, 420, 720);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText("ART-02B Production Contact Sheet", 20, 30);

  ctx.font = '12px monospace';
  
  // Row 1: Context views
  ctx.fillText("Run Screen (180x288)", 20, 60);
  ctx.drawImage(run, 20, 75);

  ctx.fillText("Garage Screen (180x288)", 220, 60);
  ctx.drawImage(gar, 220, 75);

  // Row 2: Components
  ctx.fillText("Five Families (180x288)", 20, 395);
  ctx.drawImage(slots, 20, 410);

  ctx.fillText("Five Icons (180x288)", 220, 395);
  ctx.drawImage(icons, 220, 410);

  fs.writeFileSync(path.join(reviewDir, 'contact_sheet.png'), canvas.toBuffer());
  console.log('Contact sheet generated.');
})();

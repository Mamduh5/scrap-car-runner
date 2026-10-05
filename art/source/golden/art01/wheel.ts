/**
 * ART-01 source — veh_wheel_tires_t1 (4 frames x 24x24, cutout).
 *
 * Cheap salvaged steel wheel on a bald tyre. The hub is 4-fold symmetric and the tread has an
 * 8-block period, so the 4 frames (22.5 deg apart) close a seamless 90 deg loop. The light
 * (upper right) is applied AFTER rotation so it never spins with the wheel.
 */
import { Canvas, strip, type Px } from './canvas.ts';

const C = 12; // frame centre in pixel-grid units (pixel centres at +0.5)

function wheelFrame(k: number): Canvas {
  const f = new Canvas(24, 24);
  const rot = (k * 22.5 * Math.PI) / 180;
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    const dx = x + 0.5 - C, dy = y + 0.5 - C, d = Math.hypot(dx, dy);
    if (d > 11) continue;
    const ang = Math.atan2(dy, dx) - rot;
    const deg = ((ang * 180) / Math.PI + 720) % 360;
    const screenDeg = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360; // lighting frame
    const lit = screenDeg > 285 && screenDeg < 345;                        // upper right (y is down)
    const shade = screenDeg > 105 && screenDeg < 165;                      // lower left
    let col: Px;
    if (d > 10) col = 'ink_0';
    else if (d > 7.2) {
      const block = Math.floor(deg / 22.5) % 2 === 0;
      if (d > 8.6) col = block ? (lit ? 'steel_1' : 'steel_0') : (lit ? 'ink_2' : 'ink_1');
      else col = lit ? 'ink_2' : 'ink_1';
    } else if (d > 5.6) col = lit ? 'steel_3' : shade ? 'steel_1' : 'steel_2';   // rim flange
    else {
      col = lit ? 'rust_3' : shade ? 'rust_1' : 'rust_2';                        // painted-over disc
      // 4 lightening holes (rotate with the wheel)
      for (let h = 0; h < 4; h++) {
        const a = rot + (h * Math.PI) / 2;
        const hx = Math.cos(a) * 3.6, hy = Math.sin(a) * 3.6;
        if ((dx - hx) ** 2 + (dy - hy) ** 2 <= 1.7 ** 2) col = 'ink_1';
      }
      if (d <= 1.9) col = lit ? 'steel_3' : 'steel_2';                          // hub cap
      else if (d <= 2.6 && col !== 'ink_1') col = 'rust_1';
    }
    f.set(x, y, col);
  }
  return f;
}

export function drawWheelT1(): Canvas {
  return strip([0, 1, 2, 3].map(wheelFrame));
}

import { Scene } from 'phaser';
import { UI_TYPOGRAPHY, toPhaserTextStyle, applyCasing, TypographyRole } from '../../ui/theme/typography';
import { PALETTE } from '../assets/palette'; // Assuming paletteInt exists or we can just parse hex. Wait, we imported PALETTE_HEX in typography.
// Actually we can just use parseInt(PALETTE.steel_0.replace('#', '0x')) or similar for BG colors.

export class DevTypographyScene extends Scene {
  constructor() {
    super({ key: 'DevTypographyScene' });
  }

  preload() {
    // Note: We are relying on Google Fonts loaded via index.html for this prototyping phase.
    // In production with BitmapFonts, we would load XML/PNG here.
  }

  create() {
    // Fill background with ink_0
    const ink0 = parseInt(UI_TYPOGRAPHY.buttonPrimary.color.replace('#', '0x'));
    // Actually buttonPrimary.color is ink_0. Wait, ink_0 is '#130E14'.
    this.cameras.main.setBackgroundColor('#130E14');

    let y = 10;
    const x = 10;

    // Helper to render a token
    const renderToken = (role: TypographyRole, sampleText: string, bgHex?: string) => {
      const token = UI_TYPOGRAPHY[role];
      const textStr = applyCasing(`[${role}]: ${sampleText}`, token.casing);
      const style = toPhaserTextStyle(token);
      
      // If a background color is provided, draw a rectangle behind it to test contrast
      if (bgHex) {
        // Measure text approx
        const bg = this.add.rectangle(x - 2, y - 2, 340, token.size + 4, parseInt(bgHex.replace('#', '0x')));
        bg.setOrigin(0, 0);
      }

      this.add.text(x, y, textStr, style).setResolution(1);
      
      y += token.size + (token.stroke ? token.stroke.thickness : 0) + 12;
    };

    // Render roles against their appropriate backgrounds
    renderToken('gameTitle', 'Scrap Car Runner');
    renderToken('screenTitle', 'Garage');
    renderToken('sectionHeader', 'Installed Parts');
    
    // Buttons on appropriate background
    // buttonPrimary is ink_0 on yellow_2
    renderToken('buttonPrimary', 'DRIVE', '#F5C535'); // yellow_2
    // buttonSecondary is steel_4 on steel_1
    renderToken('buttonSecondary', 'Scavenge (10)', '#565C6E'); // steel_1

    // HUD / Stats
    renderToken('distanceCounter', '1,240 m');
    renderToken('currency', '140 Scrap');
    renderToken('statLabel', 'Fuel remaining:');
    renderToken('statValue', '45% / 100%');
    renderToken('partName', 'Rusty V8 Engine');
    renderToken('tierLabel', 'TIER 3');
    
    // Body and text
    renderToken('body', 'This is a description of a part.\\nIt wraps and provides details.');
    renderToken('caption', 'Tip: Upgrade radiator for cooling.');

    // States
    renderToken('warning', 'Caution: Heat Rising!');
    renderToken('criticalWarning', 'ENGINE OVERHEATED!');
    renderToken('resultCause', 'ENGINE STALLED');
    renderToken('success', 'New Record! 1,240m');
    renderToken('toast', 'Not enough scrap.', '#211921'); // ink_1 background for toast

  }
}

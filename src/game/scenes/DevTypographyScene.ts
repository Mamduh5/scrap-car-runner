import { Scene } from 'phaser';
import { UI_TYPOGRAPHY, applyCasing, TypographyRole, TypographyToken } from '../../ui/theme/typography';

export class DevTypographyScene extends Scene {
  constructor() {
    super({ key: 'DevTypographyScene' });
  }

  preload() {
    this.load.bitmapFont('font_display', 'assets/fonts/font_display.png', 'assets/fonts/font_display.xml');
    this.load.bitmapFont('font_body', 'assets/fonts/font_body.png', 'assets/fonts/font_body.xml');
  }

  create() {
    this.cameras.main.setBackgroundColor('#130E14');

    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page') || 'A';

    let y = 10;

    // We render at x=10 with safe width 160. So text centers at x=90.
    const x = 10;
    const centerX = 90;
    const rightX = 170;

    const renderToken = (role: TypographyRole, sampleText: string, bgHex?: string) => {
      const token = UI_TYPOGRAPHY[role];
      // Don't prefix with [role] anymore to represent real usage
      const textStr = applyCasing(sampleText, token.casing);

      let measuredHeight = token.size;

      if (token.type === 'bitmap') {
        const bt = this.add.bitmapText(x, y, token.fontKey, textStr, token.size);
        const colorInt = parseInt(token.color.replace('#', '0x'));
        bt.setTint(colorInt);

        if (token.align === 'center') {
          bt.setX(centerX);
          bt.setOrigin(0.5, 0);
        } else if (token.align === 'right') {
          bt.setX(rightX);
          bt.setOrigin(1, 0);
        }

        if (token.wordWrapWidth) {
          bt.setMaxWidth(token.wordWrapWidth);
        }

        if (token.letterSpacing) {
          bt.setLetterSpacing(token.letterSpacing);
        }

        measuredHeight = bt.getTextBounds(true).global.height;

        // Expose bounds for Puppeteer
        const b = bt.getTextBounds(true).global;
        (window as any).__typographyBounds = (window as any).__typographyBounds || [];
        (window as any).__typographyBounds.push({
          role,
          fontKey: token.fontKey,
          fontSize: token.size,
          text: textStr,
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height,
          pass: b.x >= 0 && (b.x + b.width) <= 180 && b.y >= 0 && (b.y + b.height) <= 288
        });

        if (bgHex) {
           const bg = this.add.rectangle(0, y - 2, 180, measuredHeight + 4, parseInt(bgHex.replace('#', '0x')));
           bg.setOrigin(0, 0);
           bg.setDepth(-1);
        }
      }

      y += measuredHeight + 12 + (token.stroke ? token.stroke.thickness : 0);
    };

    if (page === 'A') {
      // PAGE A: Headings & Actions
      renderToken('gameTitle', 'SCRAP CAR\nRUNNER'); // wrapped to fit 180px
      renderToken('screenTitle', 'WORKSHOP');
      renderToken('sectionHeader', 'STORAGE');
      renderToken('buttonPrimary', 'SCAVENGE', '#F5C535');
      renderToken('buttonSecondary', 'REPAIR', '#2C252D');
    } else if (page === 'B') {
      // PAGE B: HUD & Stats
      renderToken('distanceCounter', '2,450 M');
      renderToken('currency', '850 SCRAP');
      renderToken('currency', '14,500 SCRAP');
      renderToken('statLabel', 'FUEL LEVEL:');
      renderToken('statValue', '45% / 100%');
      renderToken('statValue', '125 MPH');
    } else if (page === 'C') {
      // PAGE C: Inventory & Details
      renderToken('partName', 'Rusty V8 Engine');
      renderToken('tierLabel', 'TIER 3');
      renderToken('body', 'Provides moderate cooling. Prone to leaks under heavy load.');
      renderToken('body', 'Increases speed by 10%. Requires clean fuel.');
      renderToken('caption', 'Tip: Upgrade radiator for better cooling.');
    } else if (page === 'D') {
      // PAGE D: Feedback
      renderToken('warning', 'Caution: Heat Rising!');
      renderToken('criticalWarning', 'LOW FUEL!');
      renderToken('resultCause', 'ENGINE STALLED');
      renderToken('success', 'New Record!\n1,240m');
      renderToken('toast', 'Inventory full.', '#211921');
    }
  }
}
import * as phaser from 'phaser';

const menuOutline = 0xffffff;
const menuForeground = 0x031f4c;
const titleTextPadding = 10;

export class UIMenu extends phaser.GameObjects.Container {
  private static readonly uiWidth = 200;

  private readonly graphics: phaser.GameObjects.Graphics;
  private readonly titleText: phaser.GameObjects.Text;

  constructor(scene: phaser.Scene) {
    super(scene, 0, 0);

    // Create Title Text.
    this.titleText = this.scene.add.text(
      titleTextPadding,
      titleTextPadding,
      'Space Captain'
    );
    // tslint:disable-next-line:no-magic-numbers
    this.add(this.titleText);

    // Draw Initial Menu.
    this.alignBounds();
    this.graphics = this.scene.add.graphics();
    this.drawMenu();
  }

  private alignBounds(): void {
    const { width, height } = this.scene.game.canvas;
    this.x = width - UIMenu.uiWidth;
    this.y = 0;
    this.width = UIMenu.uiWidth;
    this.height = height;
  }

  private drawMenu(): void {
    this.graphics.clear();
    this.graphics.lineStyle(1, menuOutline);
    this.graphics.fillStyle(menuForeground);
    this.graphics.strokeRect(this.x, this.y, this.width, this.height);
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
  }
}

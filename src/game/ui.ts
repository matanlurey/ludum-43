import * as phaser from 'phaser';

const menuOutline = 0xffffff;
const menuForeground = 0x031f4c;
const charForeground = 0xddd;
const charHeight = 60;
const charTextSize = 14;
const paddingSize = 10;
const titleTextSize = 20;
const hpTextSize = 12;

export class UIMenu extends phaser.GameObjects.Container {
  private static readonly uiWidth = 200;

  private readonly graphics: phaser.GameObjects.Graphics;
  private readonly titleText: phaser.GameObjects.Text;
  private readonly characters: UIMenuCharacter[] = [];

  constructor(scene: phaser.Scene) {
    super(scene, 0, 0);

    // Create Title Text.
    this.titleText = this.scene.add.text(
      paddingSize,
      paddingSize,
      'Ship Captain'
    );
    this.titleText.setFontSize(titleTextSize);

    // Draw Initial Menu.
    this.graphics = this.scene.add.graphics();
    this.add(this.graphics);
    this.add(this.titleText);
    this.update();

    // Ignore Camera.
    this.setScrollFactor(0, 0);
    this.depth = 100;
  }

  public addCharacter(
    name: string,
    sprite: phaser.GameObjects.Sprite
  ): UIMenuCharacter {
    const item = new UIMenuCharacter(this.scene, sprite, this.graphics, name);
    this.add(item);
    this.characters.push(item);
    return item;
  }

  public update(): void {
    this.alignBounds();
    this.graphics.clear();
    this.graphics.lineStyle(1, menuOutline);
    this.graphics.fillStyle(menuForeground);
    this.graphics.strokeRect(0, this.y, this.width, this.height);
    this.graphics.fillRect(0, this.y, this.width, this.height);
    this.characters.forEach((c, i) => {
      // tslint:disable-next-line:no-magic-numbers
      c.update(i * charHeight + 40, this.width - paddingSize, charHeight);
    });
  }

  private alignBounds(): void {
    const { width, height } = this.scene.game.canvas;
    this.x = width - UIMenu.uiWidth;
    this.y = 0;
    this.width = UIMenu.uiWidth;
    this.height = height;
  }
}

export class UIMenuCharacter extends phaser.GameObjects.Container {
  private previewSprite!: phaser.GameObjects.Sprite;

  constructor(
    scene: phaser.Scene,
    private readonly target: phaser.GameObjects.Sprite,
    private readonly graphics: phaser.GameObjects.Graphics,
    private readonly charName: string
  ) {
    super(scene);

    this.createCharacterName();
    this.createHPandAPMeter();
    this.createPreviewOfChar(this.target);
    this.setScrollFactor(0);
  }

  public update(y: number, width: number, height: number): void {
    this.alignContent(y, width, height);
    this.drawBox();
  }

  private onClick(): void {
    this.scene.cameras.main.startFollow(this.target);
  }

  private alignContent(y: number, width: number, height: number): void {
    this.setPosition(paddingSize, y);
    this.setSize(width - paddingSize, height - paddingSize);
    this.previewSprite.setPosition(paddingSize * 2, this.height / 2);
    this.setInteractive();
  }

  private drawBox(): void {
    this.graphics.lineStyle(1, charForeground);
    this.graphics.fillStyle(1, charForeground);
    this.graphics.strokeRect(this.x, this.y, this.width, this.height);
    this.graphics.fillRect(this.x, this.y, this.width, this.height);
  }

  private createCharacterName(): void {
    const text = this.scene.add.text(
      paddingSize * 4,
      paddingSize,
      this.charName
    );
    text.setFontSize(charTextSize);
    this.add(text);
  }

  private createHPandAPMeter(): void {
    const hpText = this.scene.add.text(
      paddingSize * 4,
      // tslint:disable-next-line:no-magic-numbers
      paddingSize * 2.5,
      '5 HP 5 AP'
    );
    hpText.setFontSize(hpTextSize);
    this.add(hpText);
  }

  private createPreviewOfChar(from: phaser.GameObjects.Sprite): void {
    this.previewSprite = this.scene.add.sprite(0, 0, from.texture.key);
    this.previewSprite.setScale(0.5);
    this.add(this.previewSprite);
    this.previewSprite
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerdown', () => {
        this.onClick();
      });
    this.previewSprite.setScrollFactor(0);
  }
}

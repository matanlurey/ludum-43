import * as phaser from 'phaser';
import { UIMenu } from './game/ui';
import { UnitSprite } from './game/world/unit';

// Global Flags.
declare const FLAGS_DIMENSIONS: {
  width: number;
  height: number;
};

// Test Scene
class HelloScene extends phaser.Scene {
  private players: UnitSprite[] = [];
  private uiMenu!: UIMenu;
  private tilemap!: phaser.Tilemaps.Tilemap;

  constructor() {
    super({ key: 'HelloScene' });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', 'src/assets/spaceship.json');
    this.load.image('spaceship', 'src/assets/spaceship.png');
    this.load.image('pc1', 'src/assets/pc1.png');
    this.load.image('pc2', 'src/assets/pc2.png');
    this.load.image('pc3', 'src/assets/pc3.png');
    this.load.image('npc', 'src/assets/npc.png');
    this.load.image('laser', 'src/assets/laser.png');
  }

  public create(): void {
    this.tilemap = this.make.tilemap({ key: 'map' });
    const tileset = this.tilemap.addTilesetImage('spaceship');
    this.tilemap.createDynamicLayer(0, tileset, 0, 0);

    this.players = [
      new UnitSprite(this, 300, 300, '1'),
      new UnitSprite(this, 300, 350, '2'),
      new UnitSprite(this, 300, 400, '3'),
    ];
    this.players.forEach(p => {
      this.children.add(p);
    });

    // DEBUG Function: debugFireLaser()
    // tslint:disable-next-line:no-any
    (window as any).debugFireLaser = () => {
      this.players.forEach(p => p.fireLaser());
    };

    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
    this.createUI();
  }

  public update(_: number, __: number): void {
    this.uiMenu.update();
    this.mouseInput();
  }

  private mouseInput(): void {
    const pointer = this.input.activePointer;
    if (!pointer.isDown) {
      return;
    }
    const worldPoint: Phaser.Math.Vector2 = pointer.positionToCamera(
      this.cameras.main
    ) as Phaser.Math.Vector2;
    const clickedTile = this.tilemap.getTileAtWorldXY(
      worldPoint.x,
      worldPoint.y
    );
    if (clickedTile !== null) {
      clickedTile.setAlpha(0);
    }
  }

  private createUI(): void {
    this.uiMenu = new UIMenu(this);
    this.uiMenu.addCharacter('Jesse', this.players[0]);
    this.uiMenu.addCharacter('Alex', this.players[1]);
    this.uiMenu.addCharacter('Matan', this.players[2]);
    this.children.add(this.uiMenu);
    this.input.topOnly = true;
  }
}

(() => {
  // Constructor has side-effects.
  // tslint:disable-next-line:no-unused-expression
  new phaser.Game({
    type: phaser.AUTO,
    parent: 'content',
    width: FLAGS_DIMENSIONS.width,
    height: FLAGS_DIMENSIONS.height,
    resolution: 1,
    backgroundColor: '#EDEEC9',
    scene: [HelloScene],
  });
})();

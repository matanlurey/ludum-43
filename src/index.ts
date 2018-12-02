import * as phaser from 'phaser';
import { UIMenu } from './game/ui';
import { World } from './game/world/world';
import { Character } from './game/world/unit';
import { UILayer } from './game/world/layer';

// Global Flags.
declare const FLAGS_DIMENSIONS: {
  width: number;
  height: number;
};

// Test Scene
class HelloScene extends phaser.Scene {
  private players: Character[] = [];
  private uiMenu!: UIMenu;
  private uiLayer!: UILayer;

  private tilemap!: phaser.Tilemaps.Tilemap;
  private world!: World;
  private spaceshiplayer!: phaser.Tilemaps.DynamicTilemapLayer;

  constructor() {
    super({ key: 'HelloScene' });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', 'src/assets/spaceship.json');
    this.load.image('colors', 'src/assets/colors.png');
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
    this.spaceshiplayer = this.tilemap.createDynamicLayer(0, tileset, 0, 0);
    this.spaceshiplayer.setCollisionByProperty({ collides: true });
    this.uiLayer = new UILayer(this.tilemap);

    this.players = [];

    // this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    this.world = new World(this.tilemap, this.players);
    this.createUI();
  }

  // public panCameraToTile(tileX: number, tileY: number) {
  // const worldX = this.tilemap.worldToTileX();
  // const worldY = this.tilemap.worldToTileY();
  // this.cameras.main.setPosition(this.player, false);
  // }

  public update(_: number, __: number): void {
    this.uiMenu.update();
    this.players.forEach(p => p.update());
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
    const clickedTile = this.spaceshiplayer.getTileAtWorldXY(
      worldPoint.x,
      worldPoint.y
    );
    if (clickedTile !== null) {
      this.uiLayer.setActive(clickedTile.x, clickedTile.y);
      this.world.handleClick(clickedTile.x, clickedTile.y);
    }
  }

  private createUI(): void {
    this.uiMenu = new UIMenu(this);
    this.uiMenu.addCharacter('Jesse', this.players[0].sprite);
    this.uiMenu.addCharacter('Alex', this.players[1].sprite);
    this.uiMenu.addCharacter('Matan', this.players[2].sprite);
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

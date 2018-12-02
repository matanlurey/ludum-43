import * as phaser from 'phaser';
import { UIMenu } from './game/ui';
import { World } from './game/world/world';
import { Character } from './game/world/unit';

// Global Flags.
declare const FLAGS_DIMENSIONS: {
  width: number;
  height: number;
};

// Test Scene
class HelloScene extends phaser.Scene {
  private players: Character[] = [];
  private readonly zombies: Character[] = [];

  private cursors!: phaser.Input.Keyboard.CursorKeys;
  private uiMenu!: UIMenu;

  private tilemap!: phaser.Tilemaps.Tilemap;
  private world!: World;
  private groundLayer!: phaser.Tilemaps.DynamicTilemapLayer;

  private mouseDown: boolean = false;

  constructor() {
    super({ key: 'HelloScene' });
  }

  public preload(): void {
    this.load.tilemapTiledJSON('map', 'src/assets/spaceship.json');
    this.load.image('colors', 'src/assets/colors.png');
    this.load.image('spaceship', 'src/assets/spaceship.png');
    this.load.image('pc-1', 'src/assets/pc1.png');
    this.load.image('pc-2', 'src/assets/pc2.png');
    this.load.image('pc-3', 'src/assets/pc3.png');
    this.load.image('npc', 'src/assets/npc.png');

    this.load.image('laser', 'src/assets/laser.png');
  }

  public create(): void {
    this.tilemap = this.make.tilemap({ key: 'map' });

    const tileset = this.tilemap.addTilesetImage('spaceship');
    this.groundLayer = this.tilemap.createDynamicLayer(0, tileset, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.players = [];

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    this.world = new World(this, this.tilemap, this.players, this.zombies);
    this.createUI();
  }

  // TODO: Pan the camera to selected units
  // public panCameraToTile(tileX: number, tileY: number) {
  // const worldX = this.tilemap.worldToTileX();
  // const worldY = this.tilemap.worldToTileY();
  // this.cameras.main.centerOn()
  // }

  public update(_: number, __: number): void {
    this.uiMenu.update();
    this.players.forEach(p => p.update());
    this.zombies.forEach(p => p.update());
    this.panCameraInput();
    this.mouseInput();
  }

  private panCameraInput(): void {
    this.uiMenu.update();
    const panSpeed = 5;
    let x = 0;
    let y = 0;
    x += this.cursors.left!.isDown ? panSpeed : 0;
    x += this.cursors.right!.isDown ? -panSpeed : 0;
    y += this.cursors.down!.isDown ? -panSpeed : 0;
    y += this.cursors.up!.isDown ? panSpeed : 0;
    if (x !== 0 || y !== 0) {
      x += this.cameras.main.x;
      y += this.cameras.main.y;
      this.cameras.main.setPosition(x, y);
    }
  }

  private mouseInput(): void {
    const pointer = this.input.activePointer;
    if (pointer.isDown && !this.mouseDown) {
      this.mouseDown = pointer.isDown;
      const worldPoint: Phaser.Math.Vector2 = pointer.positionToCamera(
        this.cameras.main
      ) as Phaser.Math.Vector2;
      const clickedTile = this.groundLayer.getTileAtWorldXY(
        worldPoint.x,
        worldPoint.y
      );
      if (clickedTile !== null) {
        this.world.handleClick(clickedTile.x, clickedTile.y);
      }
    }
    this.mouseDown = pointer.isDown;
  }

  private createUI(): void {
    this.uiMenu = new UIMenu(this, this.world);
    this.players.forEach(p => this.uiMenu.addCharacter(p));
    this.children.add(this.uiMenu);
    this.input.topOnly = true;
  }

  public getUI(): UIMenu {
    return this.uiMenu;
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

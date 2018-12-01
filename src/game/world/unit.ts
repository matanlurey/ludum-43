import * as phaser from 'phaser';
import { Grid } from './grid';

/**
 * The Unit class represents a drawable unit on a Grid.
 */
export class Unit {
  private readonly tilemap: phaser.Tilemaps.Tilemap;
  private readonly sprite: phaser.GameObjects.Sprite | null;
  public readonly grid: Grid;
  private gridPosition: phaser.Math.Vector2;

  constructor(
    tilemap: phaser.Tilemaps.Tilemap,
    sprite: phaser.GameObjects.Sprite | null,
    grid: Grid,
    gridPosition: phaser.Math.Vector2
  ) {
    this.tilemap = tilemap;
    this.sprite = sprite;
    this.grid = grid;
    this.gridPosition = new phaser.Math.Vector2(gridPosition);
  }

  public getX(): number {
    return this.gridPosition.x;
  }

  public getY(): number {
    return this.gridPosition.y;
  }

  /**
   * Updates where the unit's position and where its sprite is drawn based on a grid position.
   */
  public updateSpritePosition(gridPosition: Phaser.Math.Vector2) {
    this.gridPosition = new phaser.Math.Vector2(gridPosition);
    const worldPosition = this.tilemap.tileToWorldXY(
      gridPosition.x,
      gridPosition.y
    );
    if (this.sprite !== null) {
      this.sprite.setPosition(worldPosition.x, worldPosition.y);
    }
  }

  public faceNorth(): void {
    if (this.sprite !== null) {
      this.sprite.angle = 270;
    }
  }

  public faceEast(): void {
    if (this.sprite !== null) {
      this.sprite.angle = 0;
    }
  }

  public faceSouth(): void {
    if (this.sprite !== null) {
      this.sprite.angle = 90;
    }
  }

  public faceWest(): void {
    if (this.sprite !== null) {
      this.sprite.angle = 180;
    }
  }
}

// TODO: Replace with Unit class
export class UnitSprite extends phaser.GameObjects.Sprite {
  private readonly lasers: phaser.GameObjects.Group;

  constructor(
    scene: phaser.Scene,
    x: number,
    y: number,
    sprite: '1' | '2' | '3' | 'NPC'
  ) {
    super(
      scene,
      x,
      y,
      {
        '1': 'pc1',
        '2': 'pc2',
        '3': 'pc3',
        NPC: 'npc',
      }[sprite]
    );
    this.lasers = new phaser.GameObjects.Group(this.scene);
  }

  public faceNorth(): void {
    this.angle = 270;
  }

  public faceEast(): void {
    this.angle = 0;
  }

  public faceSouth(): void {
    this.angle = 90;
  }

  public faceWest(): void {
    this.angle = 180;
  }

  public fireLaser(): void {
    const laser: phaser.GameObjects.Image = this.lasers.create(
      this.x + this.width,
      this.y + 9,
      'laser'
    );
    laser.angle = 90;
  }
}

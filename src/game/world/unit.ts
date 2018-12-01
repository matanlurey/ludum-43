import * as phaser from 'phaser';

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
    const laser: phaser.GameObjects.Image = this.lasers.create(this.x + this.width, this.y + 9, 'laser');
    laser.angle = 90;
  }
}

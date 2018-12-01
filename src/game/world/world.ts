import * as phaser from 'phaser';
import { Grid } from './grid';

/**
 * The World class defines the game world.
 */
export class World {
  private readonly grid: Grid;

  constructor(tilemap: phaser.Tilemaps.Tilemap) {
    this.grid = new Grid(tilemap);
  }

  public handleClick(gridX: number, gridY: number) {
    const collides = this.grid.get(gridX, gridY).collides();
    // tslint:disable-next-line:no-console
    console.log(
      `You clicked the tile (${gridX}, ${gridY}) and it ${
        collides ? 'does' : 'does not'
      } collide.`
    );
  }
}

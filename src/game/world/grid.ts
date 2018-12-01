import * as phaser from 'phaser';
import { Unit } from './unit';

/**
 * The Cell class defines an immutable grid cell.
 */
export class Cell {
  // Returns whether this cell blocks movement.
  public readonly collides: () => boolean;

  public readonly units: Unit[];

  constructor(collides: () => boolean) {
    this.collides = collides;
    this.units = new Array<Unit>();
  }
}

/**
 * The Grid class defines a 2D grid of Cell objects.
 */
export class Grid {
  public readonly width: number;
  public readonly height: number;
  private readonly cells: Cell[];

  // Get the cell at the given coordinates.
  public get(x: number, y: number): Cell {
    return this.cells[x + y * this.width];
  }

  // Set the cell at the given coordinates to the given Cell object.
  public set(x: number, y: number, cell: Cell): void {
    this.cells[x + y * this.width] = cell;
  }

  // Constructs a new Grid from the given tilemap.
  constructor(tilemap: phaser.Tilemaps.Tilemap) {
    this.width = tilemap.width;
    this.height = tilemap.height;

    this.cells = new Array<Cell>(this.width * this.height);
    for (let y: number = 0; y < this.height; y++) {
      for (let x: number = 0; x < this.width; x++) {
        const collidesFn = () => tilemap.getTileAt(x, y).collides;
        this.set(x, y, new Cell(collidesFn));
      }
    }
  }
}

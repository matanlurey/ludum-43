import * as phaser from 'phaser';
import { PhysicalUnit } from './unit';
import { UNIT_LAYER_NAME } from '../constants';

/**
 * The Cell class defines an immutable grid cell.
 */
export class Cell {
  private readonly mUnits: PhysicalUnit[] = [];

  /**
   * @param collides Returns whether this cell blocks movement.
   */
  constructor(
    public readonly collides: () => boolean,
    public readonly x: number,
    public readonly y: number
  ) {}

  /**
   * Adds @param unit to the cell if it does not already exist.
   *
   * Returns whether it was added.
   */
  public addUnit(unit: PhysicalUnit): boolean {
    if (!this.hasUnit(unit)) {
      this.mUnits.push(unit);
      return true;
    }
    return false;
  }

  /**
   * Returns whether @param unit is within the cell.
   */
  public hasUnit(unit: PhysicalUnit): boolean {
    return this.mUnits.indexOf(unit) !== -1;
  }

  /**
   * Removes @param unit from the cell.
   *
   * Returns whether it was removed.
   */
  public removeUnit(unit: PhysicalUnit): boolean {
    const index = this.mUnits.indexOf(unit);
    if (index === -1) {
      return false;
    }
    this.mUnits.splice(index, 1);
    return true;
  }

  /**
   * Enumerable collection of all the units in the location.
   */
  public get units(): Iterable<PhysicalUnit> {
    return this.units;
  }
}

/**
 * The Grid class defines a 2D grid of Cell objects.
 */
export class Grid {
  public readonly width: number;
  public readonly height: number;
  private readonly cells: Cell[];

  // Constructs a new Grid from the given tilemap.
  constructor(tilemap: phaser.Tilemaps.Tilemap) {
    this.width = tilemap.width;
    this.height = tilemap.height;
    this.cells = new Array<Cell>(this.width * this.height);
    for (let y: number = 0; y < this.height; y++) {
      for (let x: number = 0; x < this.width; x++) {
        const collidesFn = () => tilemap.getTileAt(x, y).collides;
        this.set(x, y, new Cell(collidesFn, x, y));
      }
    }
    const unitLayer = tilemap.getObjectLayer(UNIT_LAYER_NAME);
    unitLayer!.objects.forEach(gameObject => {
      // tslint:disable-next-line:no-console
      console.log(gameObject.name);
    });
  }

  // Get the cell at the given coordinates.
  public get(x: number, y: number): Cell {
    return this.cells[x + y * this.width];
  }

  // Set the cell at the given coordinates to the given Cell object.
  public set(x: number, y: number, cell: Cell): void {
    this.cells[x + y * this.width] = cell;
  }

  //   private gameObjectToUnit(
  //     gameObject: phaser.GameObjects.GameObject
  //   ): Unit | null {
  //     if (gameObject.name == ) return null;
  //   }
}

import * as phaser from 'phaser';
import { Grid } from './grid';
import { Unit } from './unit';

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

  /**
   * Returns an array of available unit actions for the given unit.
   */
  public static getUnitActions(unit: Unit): UnitAction[] {
    const actions: UnitAction[] = [];
    const x = unit.getX();
    const y = unit.getY();
    if (x > 0) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x - 1, y)));
    }
    if (x < unit.grid.width - 1) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x + 1, y)));
    }
    if (y > 0) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x, y - 1)));
    }
    if (y < unit.grid.height - 1) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x, y + 1)));
    }
    return actions;
  }
}

export class UnitAction {
  public readonly type: 'move' | 'attack';
  public readonly position: phaser.Math.Vector2;

  constructor(type: 'move' | 'attack', position: phaser.Math.Vector2) {
    this.type = type;
    this.position = new phaser.Math.Vector2(position);
  }
}

import * as phaser from 'phaser';
import { Grid } from './grid';
import { Character, PhysicalUnit } from './unit';

/**
 * The World class defines the game world.
 */
export class World {
  private readonly grid: Grid;

  constructor(
    private readonly tilemap: phaser.Tilemaps.Tilemap,
    private readonly players: Character[]
  ) {
    this.grid = new Grid(this.tilemap);

    // Instantiate the players.
    this.createPlayers();
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
  public getUnitActions(unit: PhysicalUnit): UnitAction[] {
    const actions: UnitAction[] = [];
    const x = unit.x;
    const y = unit.y;
    if (x > 0) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x - 1, y)));
    }
    if (x < this.grid.width - 1) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x + 1, y)));
    }
    if (y > 0) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x, y - 1)));
    }
    if (y < this.grid.height - 1) {
      actions.push(new UnitAction('move', new phaser.Math.Vector2(x, y + 1)));
    }
    return actions;
  }

  private createPlayers(): void {
    this.players.push(
      Character.create(
        this.grid,
        this.grid.get(9, 9),
        this.tilemap.scene,
        'pc1'
      ),
      Character.create(
        this.grid,
        this.grid.get(9, 11),
        this.tilemap.scene,
        'pc2'
      ),
      Character.create(
        this.grid,
        this.grid.get(9, 13),
        this.tilemap.scene,
        'pc3'
      )
    );
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

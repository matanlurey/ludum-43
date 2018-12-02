import * as phaser from 'phaser';
import { Grid } from './grid';
import { Character, PhysicalUnit } from './unit';
import { UNIT_LAYER_NAME } from '../constants';

/**
 * The World class defines the game world.
 */
export class World {
  private readonly grid: Grid;
  private selectedPlayerID: number = 0;

  constructor(
    private readonly tilemap: phaser.Tilemaps.Tilemap,
    private readonly players: Character[]
  ) {
    this.grid = new Grid(this.tilemap);

    // Instantiate the players.
    this.createPlayers();
    this.grid = new Grid(tilemap);
    this.loadFromTilemapObjectLayer(tilemap);
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

  public selectPlayer(id: number) {
    this.selectedPlayerID = id;
  }

  public getSelectedPlayer() {
    return this.selectedPlayerID;
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
        'pc1',
        'Jesse',
        5,
        5
      ),
      Character.create(
        this.grid,
        this.grid.get(9, 11),
        this.tilemap.scene,
        'pc2',
        'Alex',
        3,
        7
      ),
      Character.create(
        this.grid,
        this.grid.get(9, 13),
        this.tilemap.scene,
        'pc3',
        'Matan',
        7,
        3
      )
    );
  }

  /**
   * Loads the data from the object layer of the given tilemap.
   */
  private loadFromTilemapObjectLayer(tilemap: phaser.Tilemaps.Tilemap) {
    const unitLayer = tilemap.getObjectLayer(UNIT_LAYER_NAME);
    unitLayer!.objects.forEach(gameObject => {
      const rawAssetObject = new RawAssetObject(gameObject, tilemap);
      if (rawAssetObject !== null) {
        // TODO: Do something with the loaded objects.
        // tslint:disable-next-line:no-console
        console.log(rawAssetObject);
      }
    });
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

/**
 * The RawAssetObject class represents a Tilemap object layer object.
 */
class RawAssetObject {
  public readonly name: string;
  public readonly x: number;
  public readonly y: number;
  public readonly tileX: number;
  public readonly tileY: number;
  // These are the "Custom properties" as set in Tiled editor.
  public readonly rawProperties: Map<string, string>;

  /**
   * Constructs a RawAssetObject
   */
  constructor(
    gameObject: phaser.GameObjects.GameObject,
    tilemap: phaser.Tilemaps.Tilemap
  ) {
    // Need to access properties that are set by the asset loader but that don't
    // exist on GameObject for whatever reason.
    // tslint:disable-next-line:no-any
    const objData = (gameObject as any) as {
      name: string;
      x: number;
      y: number;
      properties: Array<{ name: string; type: string; value: string }>;
    };
    const rawProperties = new Map<string, string>();
    objData.properties.forEach(property => {
      rawProperties.set(property.name, property.value);
    });
    // We parsed them, now set this object's fields.
    this.name = objData.name;
    this.x = objData.x;
    this.y = objData.y;
    this.tileX = tilemap.worldToTileX(objData.x);
    this.tileY = tilemap.worldToTileY(objData.y);
    this.rawProperties = rawProperties;
  }
}

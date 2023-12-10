import GameTableScene from "../scenes/game-table-scene";

export default abstract class BelotGameObject {
  protected scene: GameTableScene;
  public name!: string;
  public abstract show(...args: any[]): void;
  private static _objects: BelotGameObject[] = [];
  constructor(scene: GameTableScene, name: string) {
    this.scene = scene;
    this.name = name;
    BelotGameObject._objects.push(this);
  }

  static getByName(name: string): BelotGameObject | undefined {
    return this._objects.filter(x => x.name === name)[0];
  }
}

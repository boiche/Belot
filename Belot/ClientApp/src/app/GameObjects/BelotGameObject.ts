import GameTableScene from "../scenes/game-table-scene";

export default abstract class BelotGameObject {
  protected scene: GameTableScene;
  protected abstract name: string;
  public abstract show(...args: any[]): void;
  private static _objects: BelotGameObject[] = [];
  constructor(scene: GameTableScene) {
    this.scene = scene;
    BelotGameObject._objects.push(this);
  }

  static getByName(name: string): BelotGameObject | undefined {
    return this._objects.filter(x => x.name === name)[0];
  }
}

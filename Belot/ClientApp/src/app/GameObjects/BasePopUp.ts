import { GameObjects } from 'phaser'
import GameTableScene from '../scenes/game-table-scene';

export abstract class BasePopUp {
  protected shown: boolean;
  protected sprites: GameObjects.Sprite[];
  protected abstract show(): void;
  protected scene: GameTableScene;

  constructor(scene: GameTableScene) {
    this.scene = scene;
    this.sprites = [];
    this.shown = false;
  }

  hide(): void {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i]
        .removeAllListeners()
        .removeFromDisplayList()
        .removeInteractive();

      this.scene.children.getByName(this.sprites[i].name)?.destroy();
    }
    this.shown = false;
  }
}

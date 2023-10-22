import { GameObjects } from 'phaser'
import GameTableScene from '../../scenes/game-table-scene';
import BelotGameObject from '../BelotGameObject';

export abstract class BasePopUp extends BelotGameObject {
  protected shown: boolean;
  protected sprites: GameObjects.GameObject[];  
  protected scene!: GameTableScene;

  constructor(scene: GameTableScene, name: string) {
    super(scene, name);
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

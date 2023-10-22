import { GameObjects } from "phaser";
import { constants, gameOptions } from "../../../main";
import GameTableScene from "../../scenes/game-table-scene";
import Button from "./Button";

export default class OptionsButton extends Button {
  private config: OptionsButtonConfiguration;
  constructor(scene: GameTableScene, config: OptionsButtonConfiguration) {
    super(scene, config.name);
    this.config = config;
  }
  public click(): void {
      throw new Error("Method not implemented.");
  }
  public override show(): void {
    this.scene.add.sprite(this.config.originPoint.x, this.config.originPoint.y, constants.optionsButton)
      .setDisplaySize(this.config.width, this.config.height)
      .setOrigin(0, 0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(0xD3DCE5); this.input.cursor = 'hand'; }) //TODO: find a way to provide setTint number from outer source
      .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
      .on('pointerdown', function (this: GameObjects.Sprite, event: any) {
        var scene = (this.scene as GameTableScene);

        scene.optionsPopUp.show();
      });
  }
}

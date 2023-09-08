import { GameObjects } from "phaser";
import { constants, gameOptions } from "../../../main";
import GameTableScene from "../../scenes/game-table-scene";
import Button from "./Button";

export default class OptionsButton extends Button {
  private config: OptionsButtonConfiguration;
  public get name() {
    return this.config.name;
  }
  constructor(scene: GameTableScene, config: OptionsButtonConfiguration) {
    super(scene);
    this.config = config;
  }
  public click(): void {
      throw new Error("Method not implemented.");
  }
  public override show(): void {
    this.scene.add.image(this.config.originPoint.x + 30, this.config.originPoint.y + 30, constants.optionsButton)
      .setScale(0.5, 0.5)
      .setOrigin(0, 0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerover', function (this: GameObjects.Sprite, event: any) { this.setTint(gameOptions.hoverColor); this.input.cursor = 'hand'; })
      .on('pointerout', function (this: GameObjects.Sprite, event: any) { this.clearTint(); this.input.cursor = 'pointer'; })
      .on('pointerdown', function (this: GameObjects.Sprite, event: any) {
        var scene = (this.scene as GameTableScene);

        scene.optionsPopUp.show();
      });
  }
}

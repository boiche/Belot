import GameTableScene from "../../scenes/game-table-scene";
import { BasePopUp } from "./BasePopUp";

export default class OptionsPopUp extends BasePopUp {
  protected name: string;

  constructor(scene: GameTableScene) {
    super(scene);
    this.name = "SHOULD GET THE NAME FROM CONFIG";
  }

  public override show(): void {
      throw new Error("Method not implemented.");
  }  
}

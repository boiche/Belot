import GameTableScene from "../../scenes/game-table-scene";
import { BasePopUp } from "./BasePopUp";

export default class OptionsPopUp extends BasePopUp {
  constructor(scene: GameTableScene) {
    super(scene, "SHOULD GET THE NAME FROM CONFIG");
  }

  public override show(): void {
      throw new Error("Method not implemented.");
  }  
}

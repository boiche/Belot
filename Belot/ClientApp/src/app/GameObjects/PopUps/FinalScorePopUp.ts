import GameScore from "../../BelotEngine/GameScore";
import GameTableScene from "../../scenes/game-table-scene";
import { BasePopUp } from "./BasePopUp";

export default class FinalScorePopUp extends BasePopUp {
  protected name: string;    
  private depth: number;
  private gameScore: GameScore;
  private isWinning: boolean;
  constructor(scene: GameTableScene, score: any, depth: number, isWinning: boolean) {
    super(scene);
    this.depth = depth;
    this.gameScore = score;
    this.isWinning = isWinning;
    this.name = "SHOULD GET THE NAME FROM CONFIG";
  }

  public override show(): void {
    if (this.isWinning)
      this.showWinning();
    else
      this.showLosing();
  }

  private showLosing() {
    var camera = this.scene.cameras.main;
    this.scene.add.text(camera.centerX, camera.centerY, 'DEFEAT', {
      fontSize: '42px'
    }).setOrigin(0.5, 0.5);
  }

  private showWinning() {
    var camera = this.scene.cameras.main;
    this.scene.add.text(camera.centerX, camera.centerY, 'VICTORY', {
      fontSize: '42px'      
    }).setOrigin(0.5, 0.5);
  }
}

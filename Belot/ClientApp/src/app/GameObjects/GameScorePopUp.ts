import { constants } from "../../main";
import GameScore from "../BelotEngine/GameScore";
import GameTableScene from "../scenes/game-table-scene";
import { BasePopUp } from "./BasePopUp";

class GameScorePopUp extends BasePopUp {
  private _depth: number;
  private score: any;

  constructor(scene: GameTableScene, score: any, depth: number) {
    super(scene);
    this._depth = depth;
    this.score = score;
  }

  override show() {
    try {
      console.log(this.score);

      var point = new Phaser.Geom.Point(this.scene.windowWidth / 2, this.scene.windowHeight / 2);
      var background = this.scene.add.sprite(this.scene.windowWidth / 2, this.scene.windowHeight / 2, constants.gameScoreBackground)
        .setName(constants.belotGameObjectName + constants.gameScoreBackground)
        .setDepth(this._depth - 1);

      var config: Phaser.Types.GameObjects.Text.TextStyle = {
        color: '#000000',
        fontStyle: 'bold',
        fontSize: '52'
      };

      var weScore = this.scene.currentPlayer.team == 0 ? this.score.score.lastGameTeamA.toString() : this.score.score.lastGameTeamB.toString();
      var youScore = this.scene.currentPlayer.team == 0 ? this.score.score.lastGameTeamB.toString() : this.score.score.lastGameTeamA.toString();

      var weScoreLabel = this.scene.add.text(point.x - 100, point.y, weScore, config)
        .setName(constants.gameScoreItem)
        .setFontSize(52)
        .setDepth(this._depth + 1);

      var youScoreLabel = this.scene.add.text(point.x + 65, point.y, youScore, config)
        .setName(constants.gameScoreItem)
        .setFontSize(52)
        .setDepth(this._depth + 1);

      var weLabel = this.scene.add.text(weScoreLabel.x, weScoreLabel.y - weScoreLabel.height - 15, 'WE', config)
        .setName(constants.gameScoreItem)
        .setFontSize(52)
        .setDepth(this._depth + 1);

      this.scene.add.text(youScoreLabel.x - 10, youScoreLabel.y - youScoreLabel.height - 15, 'YOU', config)
        .setName(constants.gameScoreItem)
        .setFontSize(52)
        .setDepth(this._depth + 1);

      if (this.score.score.isCapo) {
        this.scene.add.text(weLabel.x + weLabel.width, weLabel.y - weLabel.height - 15, 'CAPO', config)
          .setName(constants.gameScoreItem)
          .setFontSize(52)
          .setDepth(this._depth + 1);
      }
      else if (this.score.score.isVutreTeamA || this.score.score.isVutreTeamB) {
        this.scene.add.text(weLabel.x + weLabel.width, weLabel.y - weLabel.height - 15, 'VUTRE', config)
          .setName(constants.gameScoreItem)
          .setFontSize(52)
          .setDepth(this._depth + 1);
      }

      this.shown = true;
    } catch (e) {
      console.log(e);
    }
   
  }
}

enum GameScoreTypes {
  NONE,
  CAPO,
  VUTRE
}

export default GameScorePopUp

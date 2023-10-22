import { constants } from "../../../main";
import GameScore from "../../BelotEngine/GameScore";
import GameTableScene from "../../scenes/game-table-scene";
import { BasePopUp } from "./BasePopUp";

class GameScorePopUp extends BasePopUp {
  private _depth: number;
  private gameScore: GameScore;
  visibleDuration: number;
  private mainCamera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: GameTableScene, score: GameScore, depth: number, visibleDuration: number = 10000) {
    super(scene, "SHOULD GET THE NAME FROM CONFIG");
    this._depth = depth;
    this.gameScore = score;
    this.visibleDuration = visibleDuration;
    this.mainCamera = scene.cameras.main;
  }

  override show() {
    var point = new Phaser.Geom.Point(this.mainCamera.width / 2, this.mainCamera.height / 2);
    var background = this.scene.add.sprite(this.mainCamera.width / 2, this.mainCamera.height / 2, constants.gameScoreBackground)
      .setName(constants.gameScoreItem + ' gameScoreBackground')
      .setDepth(this._depth - 1);

    var config: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000000',
      fontStyle: 'bold',
      fontSize: '52'
    };

    var weScore = this.scene.currentPlayer.team == 0 ? this.gameScore.lastGameTeamA.toString() : this.gameScore.lastGameTeamB.toString();
    var youScore = this.scene.currentPlayer.team == 0 ? this.gameScore.lastGameTeamB.toString() : this.gameScore.lastGameTeamA.toString();

    var weScoreLabel = this.scene.add.text(point.x - 100, point.y, weScore, config)
      .setName(constants.gameScoreItem + ' weScoreLabel')
      .setFontSize(52)
      .setDepth(this._depth + 1);

    var youScoreLabel = this.scene.add.text(point.x + 65, point.y, youScore, config)
      .setName(constants.gameScoreItem + ' youScoreLabel')
      .setFontSize(52)
      .setDepth(this._depth + 1);

    var weLabel = this.scene.add.text(weScoreLabel.x, weScoreLabel.y - weScoreLabel.height - 15, 'WE', config)
      .setName(constants.gameScoreItem + ' weLabel')
      .setFontSize(52)
      .setDepth(this._depth + 1);

    this.scene.add.text(youScoreLabel.x - 10, youScoreLabel.y - youScoreLabel.height - 15, 'YOU', config)
      .setName(constants.gameScoreItem + ' youLabel')
      .setFontSize(52)
      .setDepth(this._depth + 1);

    if (this.gameScore.isCapo) {
      this.scene.add.text(weLabel.x + weLabel.width, weLabel.y - weLabel.height - 15, 'CAPO', config)
        .setName(constants.gameScoreItem + ' capo')
        .setFontSize(52)
        .setDepth(this._depth + 1);
    }
    else if (this.gameScore.isVutreTeamA || this.gameScore.isVutreTeamB) {
      this.scene.add.text(weLabel.x + weLabel.width, weLabel.y - weLabel.height - 15, 'VUTRE', config)
        .setName(constants.gameScoreItem + ' vutre')
        .setFontSize(52)
        .setDepth(this._depth + 1);
    }

    this.shown = true;
    this.sprites = this.scene.children.getChildren().filter(x => x.name.startsWith(constants.gameScoreItem));

    setTimeout(() => this.hide(), this.visibleDuration);    
  }
}

export default GameScorePopUp

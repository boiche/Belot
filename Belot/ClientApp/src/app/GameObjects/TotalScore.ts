import { constants } from "../../main";
import GameTableScene from "../scenes/game-table-scene";
import BelotGameObject from "./BelotGameObject"

export default class TotalScore extends BelotGameObject {
  private config: TotalScoreConfiguration;
  private font_to_width = 5.475;
  constructor(scene: GameTableScene, config: TotalScoreConfiguration) {
    super(scene, config.name);
    this.config = config;
  }

  public override show(): void {
    var sidebarGraphics = this.scene.add.graphics();

    sidebarGraphics.fillStyle(0xd2b14c, 1);
    var rectangle = new Phaser.Geom.Rectangle(this.config.originPoint.x, this.config.originPoint.y, this.config.width, this.config.width);
    sidebarGraphics.fillRectShape(rectangle);

    sidebarGraphics.lineStyle(5, 0x00000, 1);
    sidebarGraphics.strokeLineShape(rectangle.getLineA());
    sidebarGraphics.strokeLineShape(rectangle.getLineB());
    sidebarGraphics.strokeLineShape(rectangle.getLineC());
    sidebarGraphics.strokeLineShape(rectangle.getLineD());

    var weLabel = this.scene.add.text(rectangle.x + rectangle.width * 0.1, rectangle.y + rectangle.width * 0.1, 'WE', this.config.fontStyle)
      .setName(constants.gameScoreTotalItem + 'weLabel')
      .setDepth(10)
      .setFontSize(rectangle.width / this.font_to_width);

    var youLabel = this.scene.add.text(weLabel.x + weLabel.width + rectangle.width * 0.2, weLabel.y, 'YOU', this.config.fontStyle)
      .setName(constants.gameScoreTotalItem + ' youLabel')
      .setDepth(10)
      .setFontSize(rectangle.width / this.font_to_width);

    this.scene.add.text(weLabel.x, weLabel.y + weLabel.height + 15, '0', this.config.fontStyle)
      .setName(constants.gameScoreTotalItem + ' weScoreLabel')
      .setDepth(10)
      .setFontSize(rectangle.width / this.font_to_width);

    this.scene.add.text(youLabel.x, youLabel.y + youLabel.height + 15, '0', this.config.fontStyle)
      .setName(constants.gameScoreTotalItem + ' youScoreLabel')
      .setDepth(10)
      .setFontSize(rectangle.width / this.font_to_width);
  }
}

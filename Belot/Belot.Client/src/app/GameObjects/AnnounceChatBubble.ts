import { constants } from "../../main";
import { HandPositionOptions } from "../BelotEngine/Dealer";
import GameTableScene from "../scenes/game-table-scene";
import BelotGameObject from "./BelotGameObject";

export default class AnnounceChatBubble extends BelotGameObject {
  private _scene!: GameTableScene;
  private _options: HandPositionOptions;
  private _announcementText: string;

  constructor(scene: GameTableScene, announcementText: string) {
    super(scene, "SHOULD GET THE NAME FROM CONFIG");
    this._options = new HandPositionOptions(this._scene.cameras.main);
    this._announcementText = announcementText;
  }

  public override show(playerRelativeIndex: PlayerNumber) {
    var rectangle;
    var passHeight = 76, passWidth = 76;

    switch (playerRelativeIndex) {
      case 0: {
        rectangle = this._scene.add.rectangle(
          this._options.mainPlayerConfiguration.specifics.middlePoint.x - passWidth / 2,
          this._options.mainPlayerConfiguration.specifics.middlePoint.y - passHeight,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;
      case 1: {
        rectangle = this._scene.add.rectangle(
          this._options.leftPlayerConfiguration.specifics.middlePoint.x,
          this._options.leftPlayerConfiguration.specifics.middlePoint.y - passHeight / 2,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;
      case 2: {
        rectangle = this._scene.add.rectangle(
          this._options.upPLayerConfiguration.specifics.middlePoint.x - passWidth / 2,
          this._options.upPLayerConfiguration.specifics.middlePoint.y,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;
      case 3: {
        rectangle = this._scene.add.rectangle(
          this._options.rightPlayerConfiguration.specifics.middlePoint.x - passWidth,
          this._options.rightPlayerConfiguration.specifics.middlePoint.y - passHeight / 2,
          passWidth,
          passHeight,
          0xffffff,
          1
        );
      }; break;      
    }
    rectangle
      .setOrigin(0, 0)
      .setName(constants.belotGameObjectName + ' ' + constants.inFieldAnnouncement + ' ' + playerRelativeIndex);

    var text = this._scene.add.text(rectangle.x, rectangle.y, this._announcementText)
      .setOrigin(0, 0)
      .setDepth(rectangle.depth + 1)
      .setFontSize(28)
      .setColor('black')
      .setName(constants.belotGameObjectName + ' ' + constants.inFieldAnnouncement + ' ' + playerRelativeIndex);

    rectangle.width = text.width + 10;

    switch (playerRelativeIndex) {
      case 0:
      case 2: {
        var offsetFromCenter = rectangle.x + rectangle.width / 2 - this._options.sceneMiddlePoint.x;
        console.log('offsetFromCenter ' + offsetFromCenter);
        if (offsetFromCenter > 0)
          rectangle.x -= offsetFromCenter;
        else
          rectangle.x += offsetFromCenter;
      }; break;
      case 3: {
        rectangle.x = (this._options.rightPlayerConfiguration.specifics.middlePoint.x - rectangle.width);
      }; break;
    }

    //center the text in the rectangle
    text.y += rectangle.height / 2 - text.height / 2;
    text.x = rectangle.x + (rectangle.width - text.width) / 2;

    setTimeout(this.removeBubble, 2500, [this, playerRelativeIndex]);
  }

  removeBubble(args: any[]) {
    var bubble = args[0] as AnnounceChatBubble;
    var playerRelativeIndex = args[1];

    bubble._scene
      .children
      .getAll()
      .filter(x => x.name === `${constants.belotGameObjectName} ${constants.inFieldAnnouncement} ${playerRelativeIndex}`)
      .forEach(x => x.destroy(true));
  }
}

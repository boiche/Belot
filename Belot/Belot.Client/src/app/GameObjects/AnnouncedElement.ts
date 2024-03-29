import { constants } from "../../main";
import { GameAnnouncementType } from "../BelotEngine/Announcement";
import { HandPositionOptions } from "../BelotEngine/Dealer";
import GameTableScene from "../scenes/game-table-scene";
import BelotGameObject from "./BelotGameObject";

export default class AnnouncedElement extends BelotGameObject {
  private _scene!: GameTableScene;
  private _options: HandPositionOptions;
  private _announcement: GameAnnouncementType;
  constructor(scene: GameTableScene, announcement: GameAnnouncementType) {
    super(scene, "SHOULD GET THE NAME FROM CONFIG");
    this._options = new HandPositionOptions(this._scene.cameras.main);
    this._announcement = announcement;
  }

  public override show(relativeIndex: number) {
    if (this._announcement === GameAnnouncementType.PASS)
      return;

    this._scene.children.getByName(constants.belotGameObjectName + constants.announcementElement)?.destroy(true);
    let image!: Phaser.GameObjects.Image;
    switch (this._announcement) {
      case GameAnnouncementType.CLUBS: {
        image = this._scene.add.image(this._options.sceneMiddlePoint.x, this._options.sceneMiddlePoint.y, constants.clubsGameAnnouncementElement);
      } break;
      case GameAnnouncementType.DIAMONDS: {
        image = this._scene.add.image(this._options.sceneMiddlePoint.x, this._options.sceneMiddlePoint.y, constants.diamondsGameAnnouncementElement);          
      } break;
      case GameAnnouncementType.HEARTS: {
        image = this._scene.add.image(this._options.sceneMiddlePoint.x, this._options.sceneMiddlePoint.y, constants.heartsGameAnnouncementElement);         
      } break;
      case GameAnnouncementType.SPADES: {
        image = this._scene.add.image(this._options.sceneMiddlePoint.x, this._options.sceneMiddlePoint.y, constants.spadesGameAnnouncementElement);          
      } break;
      case GameAnnouncementType.NOSUIT: {
        image = this._scene.add.image(this._options.sceneMiddlePoint.x, this._options.sceneMiddlePoint.y, constants.noSuitGameAnnouncementElement);          
      } break;
      case GameAnnouncementType.ALLSUITS: {
        image = this._scene.add.image(this._options.sceneMiddlePoint.x, this._options.sceneMiddlePoint.y, constants.allSuitsGameAnnouncementElement);          
      } break;      
    }

    image.setName(constants.belotGameObjectName + constants.announcementElement);

    switch (relativeIndex) {
      case 0: {
        image.y = this._options.mainPlayerConfiguration.specifics.middlePoint.y - image.height;
      } break;
      case 1: {
        image.x = this._options.leftPlayerConfiguration.specifics.middlePoint.x + image.width;
      } break;
      case 2: {
        image.y = this._options.upPLayerConfiguration.specifics.middlePoint.y + image.height;
      } break;
      case 3: {
        image.x = this._options.rightPlayerConfiguration.specifics.middlePoint.x - image.width;
      }; break;
    }
  }
}

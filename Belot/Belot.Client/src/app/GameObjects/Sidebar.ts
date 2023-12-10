import GameTableScene from "../scenes/game-table-scene";
import BelotGameObject from "./BelotGameObject";

export default class Sidebar extends BelotGameObject {
  private config: SidebarConfiguration;
  public get width() {
    return this.config.width;
  }
  public get originPoint() {
    return this.config.point;
  }
  constructor(scene: GameTableScene, config: SidebarConfiguration) {
    super(scene, config.name);
    this.config = config;
  }

  public override show(): void {
    var sidebarGraphics = this.scene.add.graphics();

    switch (this.config.orientation) {
      case 'left': {
        sidebarGraphics.fillGradientStyle(this.config.mainColor, this.config.secondaryColor, this.config.mainColor, this.config.secondaryColor, 1);
        sidebarGraphics.fillRect(this.config.point.x, this.config.point.y, this.config.width, this.scene.cameras.main.height);

        sidebarGraphics.lineStyle(10, 0x00000, 1);
        sidebarGraphics.lineBetween(this.config.point.x + this.config.width, this.config.point.y, this.config.point.x + this.config.width, this.scene.cameras.main.height);
      } break;
      case 'right': {
        sidebarGraphics.fillGradientStyle(this.config.secondaryColor, this.config.mainColor, this.config.secondaryColor, this.config.mainColor, 1);
        sidebarGraphics.fillRect(this.config.point.x, this.config.point.y, this.config.width, this.scene.cameras.main.height);

        sidebarGraphics.lineStyle(10, 0x00000, 1);
        sidebarGraphics.lineBetween(this.config.point.x, this.config.point.y, this.config.point.x, this.scene.cameras.main.height);
      } break;
    }
  }
}

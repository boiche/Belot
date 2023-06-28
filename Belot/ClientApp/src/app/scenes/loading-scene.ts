import { GameObjects, Scene } from "phaser";
import { constants } from "../../main";
import { SignalRPlugin } from "./main-scene";

class LoadingScene extends Scene {
  private get loadingText(): string {
    return `${this.joinedPlayers}/4 players have joined`
  };
  private joinedPlayers: number = 1;
  private signalR!: SignalRPlugin
  constructor() {
    super("LoadingBelot");
  }

  create() {
    this.signalR = this.plugins.get('signalR') as SignalRPlugin;
    this.signalR.Connection.on("JoinedGame", (connectedPlayers: any) => {
      console.log('Server says that there are: ' + connectedPlayers);
      this.joinedPlayers = connectedPlayers;
      this.showLoader();
      this.updateText();
      //TODO: obtain already connected players
    });
  }

  showLoader() {
    this.add.image(0, 0, "background").setDisplaySize(this.cameras.main.width, this.cameras.main.height).setOrigin(0).setDepth(1);
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 50, this.loadingText, {
      color: 'white',
      fontSize: '67px',
    }).setName(constants.belotGameObjectName + constants.loadingText).setDepth(2).setOrigin(0.5);    
  }

  updateText() {
    let textObject = this.children.getByName(constants.belotGameObjectName + constants.loadingText) as GameObjects.Text;
    if (this.joinedPlayers < 4)
      textObject.text = this.loadingText;
    else
      textObject.text = 'Loading game...';
  }
}

export default LoadingScene

import { GameObjects, Scene } from "phaser";
import { constants } from "../../main";
import BelotGame from "../BelotEngine/BelotGame";
import BelotProxy from "../server-api/proxies/belotProxy";
import GetGameRequest from "../server-api/requests/get-game-request";
import { SignalRPlugin } from "./main-scene";

class LoadingScene extends Scene {
  private get loadingText(): string {
    return `${this.joinedPlayers}/4 players have joined`
  };
  private joinedPlayers: number = 0;
  private signalR!: SignalRPlugin;
  private _belotProxy: BelotProxy;
  private _belotGame!: BelotGame;
  constructor() {
    super("LoadingBelot");
    this._belotProxy = new BelotProxy();
  }

  create(belotGame: BelotGame) {  
    this.signalR = this.plugins.get('signalR') as SignalRPlugin;
    this.signalR.Connection.on("JoinedGame", () => {
      this.joinedPlayers++;
      this.updateText();
    });
    if (this.joinedPlayers < 1) {
      if (belotGame.id === undefined) {
        this.joinedPlayers = 1;
        this.showLoader();
      }
      else {
        var request = new GetGameRequest();
        request.id = belotGame.id.toString();
        request.requestUrl = 'BelotGame/GetGame?id=' + belotGame.id;
        this._belotProxy.getGame(request).subscribe((res) => {
          console.log(res);
          this.joinedPlayers = res.data.game.connectedPlayers;
          this.showLoader();
          this.updateText();
        });
      }
    }
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
      textObject.setText(this.loadingText);
    else 
      textObject.setText('Loading game...');    
  }
}

export default LoadingScene

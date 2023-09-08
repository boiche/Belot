import { Component, HostListener } from '@angular/core';
import { ScaleModes, Scene } from 'phaser'
import BootGameScene from './boot-game-scene';
import GameTableScene from './game-table-scene';
import LoadingScene from './loading-scene';
import ISignalRProxy from '../server-api/proxies/interfaces/ISignalRProxy';
import SignalRProxy from '../server-api/proxies/signalRProxy';
import BelotGame from '../BelotEngine/BelotGame';

@Component({
  selector: 'thisIsNotComponent',
  templateUrl: './empty.html',
})
class MainScene extends Scene {
  private config: Phaser.Types.Core.GameConfig;
  game: Phaser.Game;
  constructor(private connection: SignalRProxy, belotGame?: BelotGame) {
    super("belot");
    this.connection = connection;
    this.config = {
      parent: "game-container",
      backgroundColor: 0x00000,
      scene: [BootGameScene, LoadingScene, GameTableScene],      
      plugins: {
        global: [
          {
            key: 'signalR', plugin: SignalRPlugin, start: true, data: this.connection
          }
        ]
      },
      scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
      }      
    };
    this.game = new Phaser.Game(this.config);    
    this.game.scene.start('BootBelot', belotGame);
  }

  gameWidth = 0; gameHeight = 0;  

  @HostListener("window:resize", ['$event'])
  resizeGame() {    
    var canvas = document.querySelector("canvas") ?? new HTMLCanvasElement();
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 5;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = (this.game.config.width as number) / (this.game.config.height as number);
    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
      canvas.style.width = (windowHeight * gameRatio) + "px";
      canvas.style.height = windowHeight + "px";
    }

    this.gameWidth = Number.parseInt(canvas.style.width.replace('px', ''));
    this.gameHeight = Number.parseInt(canvas.style.height.replace('px', ''));    
  }
}

class SignalRPlugin extends Phaser.Plugins.BasePlugin {
  private connection: ISignalRProxy;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.connection = SignalRProxy.prototype;    
  }

  init(connection: ISignalRProxy) {
    this.pluginManager.registerGameObject('connection', () => connection);
    this.connection = connection;
  }

  public get Connection() {
    return this.connection;
  }
}

export { MainScene, SignalRPlugin }

import { Component, HostListener } from '@angular/core';
import { Scene } from 'phaser'
import BootGameScene from './boot-game-scene';
import GameTableScene from './game-table-scene';
import LoadingScene from './loading-scene';
import ISignalRProxy from '../proxies/interfaces/ISignalRProxy';
import SignalRProxy from '../proxies/signalRProxy';

@Component({
  selector: 'thisIsNotComponent',
  templateUrl: './empty.html',
})
class MainScene extends Scene {
  constructor(private connection: SignalRProxy) {
    super("belot");
    this.connection = connection;
    this.resizeGame();
  }

  gameWidth = 0; gameHeight = 0;  

  config: Phaser.Types.Core.GameConfig = {
    backgroundColor: 0x00000,
    width: this.gameWidth,
    height: this.gameHeight,    
    scene: [BootGameScene, LoadingScene, GameTableScene],
    plugins: {
      global: [
        { key: 'signalR', plugin: SignalRPlugin, start: true, data: this.connection }
      ]
    },
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  };

  game: Phaser.Game = new Phaser.Game(this.config);

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

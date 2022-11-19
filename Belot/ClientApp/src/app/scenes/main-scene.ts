import { Component, HostListener } from '@angular/core';
import { Scene } from 'phaser'
import BootGameScene from './boot-game-scene';
import GameTableScene from './game-table-scene';
import SpinnerPlugin from 'phaser3-rex-plugins/templates/spinner/spinner-plugin';
import { HubConnection } from '@microsoft/signalr';
import LoadingScene from './loading-scene';

@Component({
  selector: 'thisIsNotComponent',
  templateUrl: './empty.html',
})
class MainScene extends Scene {
  constructor() {
    super("belot");
  }

  config: Phaser.Types.Core.GameConfig = {
    backgroundColor: 0x00000,
    width: window.innerWidth,
    height: window.innerHeight,
    plugins: {
      scene: [{
        key: "rexSpinner",
        plugin: SpinnerPlugin,
        mapping: "rexSpinner"
      }]
    },
    scene: [BootGameScene, LoadingScene, GameTableScene],
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

  }
}


export default MainScene

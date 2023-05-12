import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainScene } from '../../scenes/main-scene';
import BelotProxy from '../../server-api/proxies/belotProxy';
import SignalRProxy from '../../server-api/proxies/signalRProxy';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  scene: Phaser.Scene | undefined = undefined;

  constructor(private _router: Router, private _signalR: SignalRProxy, private belotProxy: BelotProxy) { }

  showRegister() {
    this._router.navigateByUrl('register');
  }

  showLogin() {
    this._router.navigate(['login']);
  }

  showHome() {
    this._router.navigateByUrl('');
  }

  createGameTable() {
    document.body.innerHTML = "";
    var connection = this._signalR.createConnection("");
    this.scene = new MainScene(connection as SignalRProxy);
    connection.startConnection().then(() => {
      this._signalR.invoke("CreateGame")
    });

    this._signalR.on('StartGame', (gameId) => {
      this._signalR._gameId = gameId;
      this.scene?.game.scene.start('PlayBelot', gameId);
    })
  }
}

import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { MainScene } from '../../scenes/main-scene';
import BelotProxy from '../../server-api/proxies/belotProxy';
import SignalRProxy from '../../server-api/proxies/signalRProxy';
import LogoutRequest from '../../server-api/requests/logout-request';
import CreateGameRequest from '../../server-api/requests/signalR/create-game-request';
import { appConstants } from '../contstants';
import CookieManager from '../cookie-manager';
import UserService from '../services/user-service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements DoCheck {
  scene: Phaser.Scene | undefined = undefined;
  public isLoggedIn!: boolean;

  constructor(
    private _router: Router,
    private _signalR: SignalRProxy,
    private _userService: UserService,
    private _belotProxy: BelotProxy) { }

  ngDoCheck() {
    this.isLoggedIn = this._userService.IsLoggedIn;
  }

  showRegister() {
    this._router.navigateByUrl('register');
  }

  showLogin() {
    this._router.navigate(['login']);
  }

  showHome() {
    this._router.navigateByUrl('');
  }

  showMyProfile() {
    this._router.navigateByUrl('my-profile');
  }

  logout(): void {
    let request = new LogoutRequest();
    request.username = this._userService.currentUser.userName;
    request.requestUrl = 'Users/Logout';
    this._userService.removeCurrentUser();
    CookieManager.deleteCookie(appConstants.authToken);
    this._belotProxy.logout(request).subscribe(() => {
      this._router.navigateByUrl('');
    });
  }

  createGameTable() {
    document.body.innerHTML = "";
    var connection = this._signalR.createConnection("");
    this.scene = new MainScene(connection as SignalRProxy);
    connection.startConnection().then(() => {
      let request = new CreateGameRequest();
      request.username = this._userService.currentUser.userName;      
      this._signalR.invoke("CreateGame", request)
    });

    this._signalR.on('StartGame', (gameId) => {
      this._signalR._gameId = gameId;
      this.scene?.game.scene.start('PlayBelot', gameId);
    })
  }
}

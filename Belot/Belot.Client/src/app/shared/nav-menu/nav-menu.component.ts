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
    var connection = this._signalR.createConnection("");    
    connection.startConnection().then(() => {
      let request = new CreateGameRequest();
      request.username = this._userService.currentUser.userName;
      request.prizePool = 200.00;
      this._signalR.invoke("CreateGame", request).then(() => {
        if (!this._signalR.RecentError) {
          document.body.innerHTML = "";

          let parent = document.createElement('div');
          parent.id = 'game-container';          
          document.body.appendChild(parent);

          this.scene = new MainScene(connection as SignalRProxy, undefined);
        }
      }).catch((x) => {
        alert(x);
        location.reload();
      });
    });

    this._signalR.on('StartGame', (gameId) => {
      this._signalR._gameId = gameId;
      setTimeout(() => this.scene?.game.scene.start('PlayBelot', gameId), 5000);
    })
  }
}

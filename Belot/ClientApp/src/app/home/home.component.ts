import { Component, DoCheck, OnInit } from '@angular/core';
import { MainScene } from 'src/app/scenes/main-scene';
import BelotGame from '../BelotEngine/BelotGame';
import BelotProxy from '../server-api/proxies/belotProxy';
import SignalRProxy from '../server-api/proxies/signalRProxy';
import GetAvailableGamesRequest from '../server-api/requests/get-available-games-request';
import JoinGameRequest from '../server-api/requests/signalR/join-game-request';
import UserService from '../shared/services/user-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck {
  games: BelotGame[] = [];
  scene: MainScene | undefined = undefined;
  public isLoggedIn!: boolean;

  constructor(
    private _signalR: SignalRProxy,
    private _belotProxy: BelotProxy,
    private _userService: UserService) {
  }

  ngDoCheck() {
    this.isLoggedIn = this._userService.IsLoggedIn;
  }

  ngOnInit() {    
    this.obtainGames();
  }

  obtainGames() {
    var request = new GetAvailableGamesRequest();
    request.requestUrl = 'BelotGame/GetAvailableGames';
    this._belotProxy.getAvailableGames(request).subscribe((res) => {
      this.games = res.data.games;
    });
  }

  openGameTable(game: BelotGame) {
    var connection = this._signalR.createConnection(game.id.toString());
    connection.startConnection().then(() => {
      var request = new JoinGameRequest();
      request.gameId = game.id.toString();
      request.username = this._userService.currentUser.userName;
      this._signalR.invoke("JoinGame", request).then(() => {
        if (!this._signalR.RecentError) {
          document.body.innerHTML = "";
          this.scene = new MainScene(connection as SignalRProxy, game);
        }
        else {
          this.obtainGames();
        }
      })
    });

    this._signalR.on('StartGame', (gameId) => {
      console.log('game started');
      setTimeout(() => this.scene?.game.scene.start('PlayBelot', gameId), 5000);
    })
  }
}

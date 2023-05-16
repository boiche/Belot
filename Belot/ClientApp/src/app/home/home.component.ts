import { Component, OnInit } from '@angular/core';
import { MainScene } from 'src/app/scenes/main-scene';
import BelotGame from '../BelotEngine/BelotGame';
import BelotProxy from '../server-api/proxies/belotProxy';
import SignalRProxy from '../server-api/proxies/signalRProxy';
import GetAvailableGamesRequest from '../server-api/requests/get-available-games-request';
import JoinGameRequest from '../server-api/requests/join-game-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  games: BelotGame[] = [];
  scene: Phaser.Scene | undefined = undefined;

  constructor(private _signalR: SignalRProxy, private belotProxy: BelotProxy) {
   
  }

  ngOnInit() {
    this.obtainGames();
  }

  obtainGames() {
    var request = new GetAvailableGamesRequest();
    request.requestUrl = 'BelotGame/GetAvailableGames';
    this.belotProxy.getAvailableGames(request).subscribe((res) => {
      this.games = res.data.games;
    });
  }

  openGameTable(gameId: string) {
    document.body.innerHTML = "";
    var connection = this._signalR.createConnection(gameId);
    this.scene = new MainScene(connection as SignalRProxy);
    connection.startConnection().then(() => {      
      var request = new JoinGameRequest();
      request.gameId = gameId;
      this._signalR.invoke("JoinGame", request)
    });

    this._signalR.on('StartGame', (gameId) => {
      console.log('game started');
      this.scene?.game.scene.start('PlayBelot', gameId);
    })
  }
}

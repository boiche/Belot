import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { MainScene } from 'src/app/scenes/main-scene';
import BelotGame from '../BelotEngine/BelotGame';
import BelotProxy from '../proxies/belotProxy';
import SignalRProxy from '../proxies/signalRProxy';
import GetAvailableGamesRequest from '../server-api/requests/get-available-games-request';
import JoinGameRequest from '../server-api/requests/join-game-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  games: BelotGame[] = [];
  scene: Phaser.Scene | undefined = undefined;

  constructor(private _router: Router, private _signalR: SignalRProxy, private belotProxy: BelotProxy) {
   
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import MainScene from 'src/app/scenes/main-scene';
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
  scene!: Phaser.Scene;
  games: BelotGame[] = [];

  constructor(private _router: Router, private _signalR: SignalRProxy, private belotProxy: BelotProxy) {
   
  }

  ngOnInit() {
    var request = new GetAvailableGamesRequest();
    request.requestUrl = 'BelotGame/GetAvailableGames';
    this.belotProxy.getAvailableGames(request).subscribe((res) => {
      this.games = res.data.games;
    });
  }

  openGameTable(gameId: string) {
    document.body.innerHTML = "";
    this._signalR.createConnection().startConnection().then(() => {
      var scene = new MainScene();
      var request = new JoinGameRequest();
      request.gameId = gameId;
      this._signalR.invoke("JoinGame", request).then(function () {
        scene.game.scene.start('PlayBelot');
      }).catch((error) => {
        console.error(error);
      });
    });;                
  }

  createGameTable() {
    document.body.innerHTML = "";
    var scene = new MainScene(); 
    this._signalR.createConnection().startConnection().then(() => {
      this._signalR.invoke("CreateGame").then(function () {
        scene.game.scene.start('PlayBelot');
      }).catch((error) => {
        console.error(error);
      });  
    });
  }
}

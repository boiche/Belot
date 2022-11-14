import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import MainScene from 'src/app/scenes/main-scene'
import { belotServerAPI } from '../../main';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private _router: Router) {
   
  }

  openGameTable() {
    document.body.innerHTML = "";
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(belotServerAPI + "/belotGame")
      .build();

    connection.start().then(function () {
      console.log('made connection to the server');
    });

    var scene = new MainScene();    
  }
}

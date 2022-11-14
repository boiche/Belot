import { Component } from '@angular/core';
import { Router } from '@angular/router';
import MainScene from 'src/app/scenes/main-scene'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private _router: Router) {
   
  }

  openGameTable() {
    document.body.innerHTML = "";
    var scene = new MainScene();
  }
}

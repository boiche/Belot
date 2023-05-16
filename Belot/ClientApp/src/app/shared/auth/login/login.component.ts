import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  public Username: string = "";
  public Password: string = "";
  constructor() { }

  login() {

  }
}

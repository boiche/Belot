import { Component } from '@angular/core';
import BelotProxy from '../../../server-api/proxies/belotProxy';
import LoginRequest from '../../../server-api/requests/login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  public Username: string = "";
  public Password: string = "";
  constructor(private belotProxy: BelotProxy) { }

  login() {
    var request = new LoginRequest();
    request.password = this.Password;
    request.username = this.Username;
    request.requestUrl = 'Users/Login';
    this.belotProxy.login(request).subscribe((res) => {
      console.log(res);
    });
  }
}

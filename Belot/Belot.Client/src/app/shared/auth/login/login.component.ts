import { Component } from '@angular/core';
import { Router } from '@angular/router';
import BelotProxy from '../../../server-api/proxies/belotProxy';
import LoginRequest from '../../../server-api/requests/login-request';
import CookieManager from '../../cookie-manager';
import LocalStorageManager from '../../local-storage-manager';
import { User } from '../../types/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  public Username: string = "";
  public Password: string = "";
  constructor(private belotProxy: BelotProxy, private _router: Router) { }

  login() {
    var request = new LoginRequest();
    request.password = this.Password;
    request.username = this.Username;
    request.requestUrl = 'Users/Login';
    this.belotProxy.login(request).subscribe((res) => {
      CookieManager.setCookie('authToken', res.data.authToken);
      LocalStorageManager.setData('currentUser', new User(res.data.username));

      this._router.navigateByUrl('');
    });
  }
}

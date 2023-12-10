import { Component } from '@angular/core';
import BelotProxy from '../../../server-api/proxies/belotProxy';
import RegisterRequest from '../../../server-api/requests/register-request';
import CookieManager from '../../cookie-manager';
import LocalStorageManager from '../../local-storage-manager';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']  
})
export class RegisterComponent {
  public Email: string = "";
  public Password: string = "";
  public Username: string = "";
  constructor(private belotProxy: BelotProxy) { }

  register(): void {
    var request = new RegisterRequest();
    request.email = this.Email;
    request.password = this.Password;
    request.username = this.Username;
    request.requestUrl = 'Users/Register';
    this.belotProxy.register(request).subscribe((res) => {
      console.log(res);
      CookieManager.setCookie('authToken', res.data.token);
      LocalStorageManager.setData('currentUser', res.data.user);
      CookieManager.setCookie('currentUser', res.data.user);
      location.href = '';
    });
  }
}

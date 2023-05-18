import { Component } from '@angular/core';
import { Router } from '@angular/router';
import BelotProxy from '../../../server-api/proxies/belotProxy';
import LogoutRequest from '../../../server-api/requests/logout-request';
import CookieManager from '../../cookie-manager';
import UserService from '../../services/user-service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {

  constructor(private userService: UserService, private belotProxy: BelotProxy, private router: Router) { }

  logout(): void {
    let request = new LogoutRequest();
    request.username = this.userService.currentUser?.Username ?? '';
    request.requestUrl = 'Users/Logout';
    this.userService.removeCurrentUser();
    CookieManager.deleteCookie('authToken');
    this.belotProxy.logout(request);
    location.href = '';
  }
}

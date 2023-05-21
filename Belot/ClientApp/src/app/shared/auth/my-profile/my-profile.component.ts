import { Component } from '@angular/core';
import { Router } from '@angular/router';
import UserService from '../../services/user-service';
import { Authenticated } from '../../types/decorators';
import { User } from '../../types/user';
import { BaseComponent } from '../base-component';

@Authenticated()
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent extends BaseComponent {
  public user: User = new User('');
  constructor(private _router: Router, private _userService: UserService) {
    super();
    this.user = this._userService.currentUser;
    this.shouldRedirect(_userService, _router); 
  }   
}

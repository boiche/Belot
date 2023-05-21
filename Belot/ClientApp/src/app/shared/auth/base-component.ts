import { Router } from "@angular/router";
import UserService from "../services/user-service";

export class BaseComponent {
  shouldRedirect(_userService: UserService, _router: Router) {
    if (!_userService.IsLoggedIn) {
      _router.navigateByUrl('/login');
    }
  }
}

import { appConstants } from "../contstants";
import CookieManager from "../cookie-manager";
import LocalStorageManager from "../local-storage-manager";
import { User } from "../types/user";

export default class UserService {
  public get currentUser(): User {
    try {
      if (CookieManager.getCookie(appConstants.authToken))
        return LocalStorageManager.getData<User>(appConstants.currentUser);
      else
        return User.default;
    } catch (e) {
      console.log(e);
      return User.default;
    }
  }

  public get IsLoggedIn(): boolean {
    return !(new User(this.currentUser.userName).isEmpty()) && CookieManager.getCookie(appConstants.authToken);
  }

  public removeCurrentUser() {
    LocalStorageManager.deleteData(appConstants.currentUser);
  }
}

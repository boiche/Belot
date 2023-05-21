import { appConstants } from "../contstants";
import CookieManager from "../cookie-manager";
import LocalStorageManager from "../local-storage-manager";
import { User } from "../types/user";

export default class UserService {
  public get currentUser(): User | null {
    if (CookieManager.getCookie(appConstants.authToken))
      return LocalStorageManager.getData<User>(appConstants.currentUser);
    else
      return null;
  }

  public get IsLoggedIn(): boolean {
    return this.currentUser !== null && CookieManager.getCookie(appConstants.authToken);
  }

  public removeCurrentUser() {
    LocalStorageManager.deleteData(appConstants.currentUser);
  }
}

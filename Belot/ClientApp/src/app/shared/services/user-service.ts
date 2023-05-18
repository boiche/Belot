import CookieManager from "../cookie-manager";
import LocalStorageManager from "../local-storage-manager";
import { User } from "../types/user";

export default class UserService {
  public get currentUser(): User | null {
    return LocalStorageManager.getData<User>('currentUser');
  }

  public get IsLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  removeCurrentUser() {
    LocalStorageManager.deleteData('currentUser');
  }
}

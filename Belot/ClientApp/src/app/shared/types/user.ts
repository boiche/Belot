export class User {
  constructor(username: string) {
    this.userName = username;
  }

  userName: string;

  public static get default(): User {
    return new User('');
  }

  isEmpty() {
    return this.userName === User.default.userName;
  }
}

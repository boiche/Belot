export class User {
  constructor(username: string) {
    this.Username = username;
  }

  Username: string;

  public static get default(): User {
    return new User('');
  }

  isEmpty() {
    return this.Username === User.default.Username;
  }
}

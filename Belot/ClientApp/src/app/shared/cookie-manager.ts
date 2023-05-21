export default class CookieManager {
  static setCookie(name: string, value: any, expireDays: number = 30, path: string = ""): void {
    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + expireDays);
    let expires = `expires=${expireDate}`;
    let cpath = path ? ` path=${path}` : '';

    document.cookie = `${name}=${value} ${expires}${cpath}; SameSite=None; Secure`;
  }

  static getCookie(name: string): any {
    let cookies = document.cookie.split(';');
    let currentCookie = "";

    for (var i = 0; i < cookies.length; i++) {
      currentCookie = cookies[i].replace(/^\s+/g, '');
      if (currentCookie.indexOf(name) == 0) {
        return currentCookie.substring(name.length, currentCookie.length);
      }
    }

    return null;
  }

  static deleteCookie(name: string): void {
    this.setCookie(name, null, -1);
  }
}

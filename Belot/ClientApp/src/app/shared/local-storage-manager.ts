export default class LocalStorageManager {
  public static setData(name: string, value: any): void {
    localStorage.setItem(name, JSON.stringify(value));
  }

  public static getData<T>(name: string): T | null {
    let data = localStorage.getItem(name);
    if (data) {
      return JSON.parse(data ?? '') as T;
    }
    else {
      return null;
    }
  }

  public static deleteData(name: string): void {
    localStorage.removeItem(name);
  }
}

export default class LocalStorageManager {
  public static setData(name: string, value: any): void {
    localStorage.setItem(name, JSON.stringify(value));
  }

  public static getData<T>(name: string): T {
    let data = localStorage.getItem(name);
    if (data) {
      return JSON.parse(data ?? '') as T;
    }
    else {
      throw new Error(`No data assigned for key: ${name}`);
    }
  }

  public static deleteData(name: string): void {
    localStorage.removeItem(name);
  }
}

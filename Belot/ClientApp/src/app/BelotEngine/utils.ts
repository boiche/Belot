class Utils {
  public static async sleep(miliseconds: number) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }

  public static delay(miliseconds: number) {
    return new Promise(() => {
      setTimeout(() => { }, miliseconds)
    })
  }
}

export default Utils

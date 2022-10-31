class Utils {
  public static sleep(miliseconds: number) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }
}

export default Utils

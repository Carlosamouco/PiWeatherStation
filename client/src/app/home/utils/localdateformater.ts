export class LocalDateFormater {
  static formate(date: string) {
    const dateTime = new Date(date);

    const h = dateTime.getHours();
    const m = dateTime.getMinutes();

    return (h < 10? '0' + h: h) + ':' + (m < 10? '0' + m: m);
  }
}

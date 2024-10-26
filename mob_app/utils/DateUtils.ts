import moment from "moment";

export class DateUtils {
  static getDurationAsString(durationInMs: number = 0) {
    const dur = moment.duration(durationInMs ?? 0);
    const durStr = `${dur.hours()}h ${dur.minutes()}min`;
    return durStr;
  }

  static getStartEndTimeString(start: string, end: string) {
    const startTime = moment(start).format("LT");
    const endTime = moment(end).format("LT");
    return `${startTime} - ${endTime}`;
  }

  static getFormattedTime(time: string) {
    const formattedTime = moment(time).format("LT");
    return formattedTime;
  }

  static getFormattedDate(date: string) {
    return moment(date).format("MMMM Do YYYY");
  }
}

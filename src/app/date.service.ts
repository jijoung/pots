import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  convertLocalToUtc(localDate:Date): Date {
    var utcDate = new Date()
    var utcTime = localDate.getTime() + this.getTimezoneOffset(localDate) * 60000;
    utcDate.setTime(utcTime);
    return utcDate;
  }

  convertUTCToLocal(utcDate:Date): Date {
    debugger;
    var localDate = new Date()
    var localTime = utcDate.getTime() - this.getTimezoneOffset(utcDate) * 60000;
    localDate.setTime(localTime);
    return localDate;
  }

  getTimezoneOffset(date:Date): number {
    var jan = new Date(date.getFullYear(), 0, 1);
    var jul = new Date(date.getFullYear(), 6, 1);
    var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    if (date.getTimezoneOffset() < stdTimezoneOffset) {
      return date.getTimezoneOffset();
    } else {
      return stdTimezoneOffset
    }
  }

}

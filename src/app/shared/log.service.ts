import { Injectable } from '@angular/core';
import { LogEntry } from './log-entry';

@Injectable({
  providedIn: 'root'
})

export class LogService {

  constructor() {}

  log(message: string, comment: string): LogEntry {

    let entry: LogEntry = new LogEntry();
    entry.message = message;
    entry.comment = comment;
    entry.date = new Date();

    console.log(new Date() + ": " + JSON.stringify(message));

    return entry;
  }
}

import { Injectable } from '@angular/core';
import { LogEntry } from './log-entry';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LogService {

  private headers: HttpHeaders;
  private accessPointUrl: string = 'http://localhost:50022/api/LogEntries';
  
  logWithDate: boolean = true;

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public post(payload){
    
    return this.http.post(this.accessPointUrl, payload, {headers: this.headers});

   }

  log(message: string, comment: string): LogEntry {

    let entry: LogEntry = new LogEntry();
    entry.message = message;
    entry.comment = comment;
    entry.date = new Date();

    console.log(new Date() + ": " + JSON.stringify(message));

    return entry;
  }
}

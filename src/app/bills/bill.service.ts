import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LogEntry } from '../shared/log-entry';
import { Bill, BillAdapter } from './bill';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BillService {
   
  baseUrl = environment.baseUrl;
  private headers: HttpHeaders;
  private accessPointUrl = this.baseUrl + '/bills';

  constructor(private http: HttpClient, private adapter: BillAdapter) {

    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

   }
   
   public get() {
    
    return this.http.get(this.accessPointUrl, {headers: this.headers}).pipe(
      retry(2),
      map((data: any[]) => data.map((item: any) => this.adapter.fromJsonToModel(item))));

   }

   public getBillById(id) {

    return this.http.get(this.accessPointUrl + '/' + id, {headers: this.headers}).pipe(retry(2));

   }

   public getUnpaidBills() {

    return this.http.get(this.accessPointUrl + "/unpaid", {headers: this.headers});

   }

   public downloadLogs() {

    return this.http.get(this.accessPointUrl + "/download", { responseType: "blob" }).pipe(retry(2));

  }

   public postBills() {

    return this.http.post(this.accessPointUrl, null).pipe(
      retry(2),
      map((data: any[]) => data.map((item: any) => this.adapter.fromJsonToModel(item))),
      catchError(this.handleError)
    );
  }

  public postBillsForSelectedMonth(monthByName: string) {
    debugger
    return this.http.post(this.accessPointUrl, JSON.stringify(monthByName), {headers: this.headers}).pipe(
      retry(2),
      map((data: any[]) => data.map((item: any) => this.adapter.fromJsonToModel(item))),
      catchError(this.handleError)
    );
  }
  
  public remove(bill: Bill) {

    return this.http.delete(this.accessPointUrl + '/' + bill.id, {headers: this.headers}).pipe(retry(2));

  }

  public update(bill: Bill) {

    return this.http.put(this.accessPointUrl + '/' + bill.id, this.adapter.fromModelToJson(bill), {headers: this.headers})
    .pipe(retry(2));

  }

  private handleError(error: HttpErrorResponse) {
    if(error.status === 422) {
      return throwError("Bills for the selected month have already been created." + 
      "Please delete bills for the selected month and add them again.");
    }
    else{
      return throwError("Unknown error occurred.")
    }
  }

}

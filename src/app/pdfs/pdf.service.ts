import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Bill, BillAdapter } from '../bills/bill';
import { Adapter } from '../models/adapter';

@Injectable({
  providedIn: 'root'
})

export class PDFService {

  baseUrl = environment.baseUrl;

  private readonly pdfUrl: string = this.baseUrl + '/PDFs';
  
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private adapter: BillAdapter) {
    //this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  public get() {
    return this.http.get(this.pdfUrl, { responseType: "blob" }).pipe(catchError(this.handleError));
  }

  private mapBillsFromModelToJson(bills: Array<Bill>) {
    var mappedBills = bills.map((b: Bill) => this.adapter.fromModelToJson(b));

    return mappedBills;
  }

  public getBillsZip(bills: Array<Bill>) {
    //var mappedBills = bills.map((b: Bill) => this.adapter.fromModelToJson(b));

    return this.http.post(this.pdfUrl + "/getZip", {billsList: this.mapBillsFromModelToJson(bills)}, { responseType: "blob" }).pipe(catchError(this.handleError));
  }

  //to be DELETED
  public sendBillsWithEmail(bills: Array<Bill>){
    //var mappedBills = bills.map((b: Bill) => this.adapter.fromModelToJson(b));

    return this.http.post(this.pdfUrl, {billsList: this.mapBillsFromModelToJson(bills)}).pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

   private handleError(error: HttpErrorResponse) {
    if(error.status === 404) {
      return throwError("Some or all bills are missing for this month. " +  
      "Make sure you have added bills for all apartments before trying to export them.");
    }
    else if(error.status === 500){
      return throwError("An error occurred and your email was not sent. Check that there is internet connection and try again.")
    }

  }

}

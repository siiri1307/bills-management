import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Bill, BillAdapter } from "../bills/bill";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  baseUrl = environment.baseUrl;

  private readonly url: string = this.baseUrl + "/PDFs";

  constructor(private http: HttpClient, private adapter: BillAdapter) {}

  public get() {
    return this.http
      .get(this.url, { responseType: "text" })
      .pipe(catchError(this.handleError));
  }

  private mapBillsFromModelToJson(bills: Array<Bill>) {
    var mappedBills = bills.map((b: Bill) => this.adapter.fromModelToJson(b));

    return mappedBills;
  }

  public getBillsZip(bills: Array<Bill>) {
    return this.http
      .post(
        this.url + "/getZip",
        { bills: this.mapBillsFromModelToJson(bills) },
        { responseType: "blob" }
      )
      .pipe(catchError(this.handleError));
  }

  public sendBillsWithEmail(bills: Array<Bill>, emails: string[]) {
    return this.http
      .post(this.url, {
        bills: this.mapBillsFromModelToJson(bills),
        emails: emails,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(
        "Some or all bills are missing for this month. " +
          "Make sure you have added bills for all apartments before trying to export them."
      );
    } else if (error.status === 500) {
      return throwError(
        "An error occurred and your email was not sent. Check that there is internet connection and try again."
      );
    }
  }
}

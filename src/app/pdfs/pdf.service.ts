import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PDFService {

  readonly pdfUrl: string = 'http://localhost:50022/api/PDFs';
  
  constructor(private http: HttpClient) { 
  }

  public get(){
    return this.http.get(this.pdfUrl, { responseType: "blob" }).pipe(catchError(this.handleError));

   }

   private handleError(error: HttpErrorResponse) {
    if(error.status == 404){
      console.error("No bills to export.");
    }
    return throwError("There are no bills to export for this month. Please make sure you have added the bills before trying to export them.");
  }

}

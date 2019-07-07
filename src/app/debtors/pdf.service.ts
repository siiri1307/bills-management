import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  private pdfUrl: string = 'http://localhost:50022/api/PDFs';
  
  constructor(private http: HttpClient) { 
  }

  public get(){
    
    return this.http.get(this.pdfUrl, { responseType: "blob" });

   }

}

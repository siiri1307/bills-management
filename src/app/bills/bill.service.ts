import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogEntry } from '../shared/log-entry';
import { Bill, BillAdapter } from './bill';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BillService {
   
  private headers: HttpHeaders;
  private accessPointUrl: string = 'http://localhost:50022/api/bills';

  constructor(private http: HttpClient, private adapter: BillAdapter) {

    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

   }
   
   public get() {
    
    return this.http.get(this.accessPointUrl, {headers: this.headers}).pipe(
        map((data:any []) => data.map((item: any) => this.adapter.fromJsonToModel(item))),
      );
   }

   public getBillById(id){

    return this.http.get(this.accessPointUrl + '/' + id, {headers: this.headers});
   }

   public getUnpaidBills(){

    return this.http.get(this.accessPointUrl + "/unpaid", {headers: this.headers});
   }

   public downloadLogs() {

    return this.http.get(this.accessPointUrl + "/download", { responseType: "blob" });
  }

   public postBills() {

    return this.http.post(this.accessPointUrl, null).pipe(
      map((data:any []) => data.map((item: any) => this.adapter.fromJsonToModel(item))),
    );

  }

  public remove(bill: Bill) {

    return this.http.delete(this.accessPointUrl + '/' + bill.id, {headers: this.headers});

  }

  public update(bill: Bill) {

    return this.http.put(this.accessPointUrl + '/' + bill.id, this.adapter.fromModelToJson(bill), {headers: this.headers});

  }

}

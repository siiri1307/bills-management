import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BudgetEntry } from './budget-entry';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  private headers: HttpHeaders;
  private accessPointUrl: string = 'http://localhost:50022/api/budgets';

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  public get() {
    return this.http.get(this.accessPointUrl, {headers: this.headers});
  }

  public getById(id) {
    return this.http.get(this.accessPointUrl + '/' + id, {headers: this.headers});
  }

  public getTotal() {
    return this.http.get(this.accessPointUrl + "/total", {headers: this.headers});
  }

  public add(budgetEntry : BudgetEntry) {
    return this.http.post<BudgetEntry>(this.accessPointUrl, budgetEntry, {headers: this.headers});
  }
  
}

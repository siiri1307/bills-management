import { LogEntry } from "../shared/log-entry";
import { Input } from "@angular/core";
import { Injectable } from '@angular/core';
import { Adapter } from "../models/adapter";


export class Bill {

    "id": number; //how to map over object properties from backend?
    //"billId": number;
    "total": number;
    "flat": number;
    "sumToPay": number;
    "monthToPayFor": string;
    "paymentDeadline": string;
    "partialPayAmount": number;
    "status": number;
    "logs": LogEntry[];

    constructor(id: number, total: number, apartment: number, sumToPay: number, month: string, deadline: string, partialPay: number, status: number, logs: LogEntry[]){
        this.id = id;
        this.total = total; 
        this.flat = apartment;
        this.sumToPay = sumToPay;
        this.monthToPayFor = month;
        this.paymentDeadline = deadline;
        this.partialPayAmount = partialPay;
        this.status = status;
        this.logs = logs;
    }
}

@Injectable({
    providedIn: 'root'
})

//Model-Adapter pattern: adapter is an interface to ingest the API's data and build instances of the model
export class BillAdapter implements Adapter<Bill> {

    fromJsonToModel(item: any): Bill {
        return new Bill(
            item.billId,
            item.total,
            item.apartment,
            item.sumToPay,
            item.monthToPayFor,
            item.paymentDeadline,
            item.partialPayAmount,
            item.status, 
            item.logs
        )
    }

    fromModelToJson(bill: Bill): JSON {

        var o: any = {
            "BillId": bill.id, 
            "Total": bill.total, 
            "Apartment": bill.flat, 
            "SumToPay": bill.sumToPay,
            "MonthToPayFor": bill.monthToPayFor, 
            "PaymentDeadline": bill.paymentDeadline,
            "PartialPayAmount": bill.partialPayAmount,
            "Status": bill.status, 
            "Logs": bill.logs
        }
        
        return <JSON>o
    }
}
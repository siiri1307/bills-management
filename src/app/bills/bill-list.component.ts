//Component class handles data and user interactions programmatically. 
import { Component, OnInit } from "@angular/core"; //a life-cycle hook
import { Bill } from "./bill";
import { BillService } from "./bill.service";
import { BudgetService } from "../budget/budget.service";
import { BudgetEntry } from "../budget/budget-entry";
import { LogService } from "../shared/log.service";

@Component({
    selector: 'bill-list',
    templateUrl: './bill-list.component.html',
    styleUrls: ['./bill-list.component.css']
})

export class BillListComponent implements OnInit {

    public billsData: Bill[];
    public billsDataCopy: Bill[];
    columnsToDisplay = ['flat', 'total', 'sumToPay', 'monthToPayFor', 'paymentDeadline'];
        
    _filterText: string;
    
    public filteredBills: Array<Bill>;

    constructor(private billService: BillService, private budgetService: BudgetService, private logger: LogService){
        this.fetchBills();
    }

    fetchBills(): void {
        this.billService.get().subscribe((data: any) => {
            this.billsData = data;
            this.billsDataCopy = this.billsData
        });
    }

    get filterText(): string {
        return this._filterText;
    }

    set filterText(value: string) {
        this._filterText = value;
    }

    ngOnInit(): void { //ES2015 does not support interfaces. They are trans-piled out of a resulting JS.
        console.log('Doing initialization.');
    }

    doFiltering(filterBy: string): Bill[] {
        filterBy = filterBy.toLowerCase();
        return this.billsData.filter((bill: Bill) => bill.monthToPayFor.toLocaleLowerCase().indexOf(filterBy) !== -1);

    }

    saveTotalPay(bill: Bill): void {

        bill.sumToPay = 0;    

        bill.status = 1;

        let budgetEntry: BudgetEntry = {

            sum: bill.total
        };

        //this.billService.update(bill).subscribe();
        this.budgetService.add(budgetEntry).subscribe();
    }

    updateBill(bill: Bill, comment: string): void {

        bill.sumToPay -= bill.partialPayAmount;

        bill.status = 2;

        if(bill.sumToPay == 0){

            bill.status = 1;
        }

        let budgetEntry: BudgetEntry = {

            sum: bill.partialPayAmount
        };

        let log = this.logger.log("Paid " + bill.partialPayAmount + " EUR on " + new Date() + ".", comment);
       
        bill.logs.push(log);
       
        //this.logger.post(log).subscribe();

        this.budgetService.add(budgetEntry).subscribe();
        
        bill.partialPayAmount = bill.sumToPay;

        this.billService.update(bill).subscribe();      
    }

    saveBudgetEntry(paidAmount: number): void {

        var entry: BudgetEntry = {
        
            sum: paidAmount
        };

        this.budgetService.add(entry).subscribe();
    }

    filterBills(filterValue: any): void {
        if(filterValue == "0"){
            this.billsData = this.billsDataCopy;
        }
        else{
            this.billsData = this.billsDataCopy.filter((bill) => bill.status == filterValue);
        }
    }

    downloadLogs(): void {
        this.billService.downloadLogs().subscribe(csvfile => {
            var blob = new Blob([csvfile], {type: 'text/csv'});
            var fileName = 'bills.csv';
            saveAs(blob, fileName);
        })
    }

    addBills(): void {
        this.billService.postBills().subscribe((data: any) => {
            this.billsData = data;
            this.billsDataCopy = this.billsData
        });
    }

    delete(bill): void {
        this.billService.remove(bill).subscribe(() => {
            this.fetchBills();
        });
    }
}
//Component class handles data and user interactions programmatically. 
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from "@angular/core"; //a life-cycle hook
import { Bill } from "./bill";
import { BillService } from "./bill.service";
import { BudgetService } from "../budget/budget.service";
import { BudgetEntry } from "../budget/budget-entry";
import { LogService } from "../shared/log.service";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PDFService } from "../pdfs/pdf.service";
import { saveAs } from 'file-saver';
import { MatSort, MatSortable } from "@angular/material/sort";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-bill-list',
    templateUrl: './bill-list.component2.html',
    styleUrls: ['./bill-list.component.css', './bill-list.component2.css'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})

export class BillListComponent implements OnInit, AfterViewInit {

    public billsData;
    public billsDataCopy;
    columnsToDisplay = ['flat', 'total', 'sumToPay', 'monthToPayFor', 'paymentDeadline', 'delete'];
    expandedElement: Bill | null;
    _filterText: string;
    errorMessage: string
    show: boolean = false;
    public filteredBills: Array<Bill>;

    private matDataSource;

    //query the template to get references to template elements and inject them to a component
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    @ViewChild("alert", { static: false}) alert: ElementRef;

    constructor(private billService: BillService, private budgetService: BudgetService, private logger: LogService, private PDFService: PDFService, private renderer: Renderer2){
        this.billsData = new MatTableDataSource<Bill>();
        this.billsDataCopy = new MatTableDataSource<Bill>();
        this.fetchBills();
    }

    fetchBills(): void {
        this.billService.get().subscribe((data: any) => {
            //this.billsData = data;
            this.billsData.data = data;
            this.billsDataCopy = this.billsData;  
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
        this.billsData.filterPredicate = (bill: Bill, filter: number) => {
            if( filter == 0){
                return true;
            }
            return bill.status == filter;
           };
      
        this.billsData.sort = this.sort;
    }

    ngAfterViewInit(): void {
        this.billsData.paginator = this.paginator;
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
        //filtering of MatTableDataSource
        this.billsData.filter = filterValue;

        /*
        if(filterValue == "0"){
            this.billsData = this.billsDataCopy;
        }
        else{
            this.billsData = this.billsDataCopy.filter((bill) => bill.status == filterValue);
        }*/
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
        this.billsData.data = data;
        this.billsDataCopy = this.billsData},
        err => this.errorMessage = err
    ); 
      this.renderer.addClass(this.alert.nativeElement, "show");
    }

    delete(bill): void {
        this.billService.remove(bill).subscribe(() => {
            this.fetchBills();
        });
    }

    downloadBillsForRunningMonthAsPDF() {
        this.PDFService.get().subscribe(doc => {
            var blob = new Blob([doc], {type: 'application/zip'});//inserts data to a blob. Blob is a file-like object of raw immutable data
            var fileName = 'test-bills.zip';
            saveAs(blob, fileName);
        })
    }

    hideAlert(){
        //this.show = this.errorMessage = null;
        //this.alert.nativeElement.style.visibility = "hidden";
        this.renderer.removeClass(this.alert.nativeElement, "show");
        //this.alert.nativeElement.querySelector("div").classList.remove("show");
    }
}
// Component class handles data and user interactions programmatically. 
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from "@angular/core"; // a life-cycle hook
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
import { MatSort } from "@angular/material/sort";

@Component({
    selector: 'app-bill-list',
    templateUrl: './bill-list.component.html',
    styleUrls: ['./bill-list.component.css'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})

export class BillListComponent implements OnInit, AfterViewInit {

    billsData;
    columnsToDisplay = ['flat', 'total', 'sumToPay', 'monthToPayFor', 'paymentDeadline', 'delete'];
    expandedElement: Bill | null;
    _filterText: string;
    errorMessage: string;

    noBillsToExportMessage: string;
   
    // query the template to get references to template elements and inject them to a component
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    @ViewChild("duplicateBillsAlert", { static: false}) duplicateBillsAlert: ElementRef;

    @ViewChild("noBillsAlert", {static: false}) noBillsAlert: ElementRef;

    constructor(private billService: BillService, private budgetService: BudgetService, private logger: LogService, 
        private pdfService: PDFService, private renderer: Renderer2) {
        this.billsData = new MatTableDataSource<Bill>();
        this.fetchBills();
    }

    fetchBills(): void {
        this.billService.get().subscribe((data: any) => {
            this.billsData.data = data; 
        });
    }

    ngOnInit(): void {
        console.log('Doing initialization.');
        this.billsData.filterPredicate = (bill: Bill, filter: number) => {
            var filterAsNumber = +filter;
            if(filterAsNumber === 0) {
                return true;
            }
            return bill.status === filterAsNumber;
           };
      
        this.billsData.sort = this.sort;
    }

    ngAfterViewInit(): void {
        this.billsData.paginator = this.paginator;
    }

    updateBill(bill: Bill, comment: string): void {

        bill.sumToPay -= bill.partialPayAmount;

        bill.status = 2;

        if(bill.sumToPay === 0) {

            bill.status = 1;
        }

        const log = this.logger.log("Paid " + bill.partialPayAmount + " EUR on " + new Date() + ".", comment);
        
        bill.logs.push(log);
        
        this.saveBudgetEntry(bill.partialPayAmount);
    
        bill.partialPayAmount = bill.sumToPay;

        this.billService.update(bill).subscribe();  
    }

    saveBudgetEntry(paidAmount: number): void {

        const entry: BudgetEntry = {
        
            sum: paidAmount
        };

        this.budgetService.add(entry).subscribe();
    }

    filterBills(filterValue: number): void {
        this.billsData.filter = filterValue;
    }

    downloadLogs(): void {
        this.billService.downloadLogs().subscribe(csvfile => {
            const blob = new Blob([csvfile], {type: 'text/csv'});
            const fileName = 'bills.csv';
            saveAs(blob, fileName);
        });
    }

    addBills(): void {
        this.billService.postBills().subscribe((data: any) => {
            this.billsData.data = data;
        },
        err => {
            this.errorMessage = err; 
            this.renderer.addClass(this.duplicateBillsAlert.nativeElement, "show");
        });
    }

    delete(bill): void {
        this.billService.remove(bill).subscribe(() => {
            this.fetchBills();
        });
    }

    downloadBillsForRunningMonthAsPDF() {
        this.pdfService.get().subscribe(doc => {
            const blob = new Blob([doc], {type: 'application/zip'});
            const fileName = 'test-bills.zip';
            saveAs(blob, fileName);
        },
        err => {
            this.noBillsToExportMessage = err;
            this.renderer.addClass(this.noBillsAlert.nativeElement, "show");
        });
    }

    hideAlertForDuplicateBills() {
        this.renderer.removeClass(this.duplicateBillsAlert.nativeElement, "show");
    }

    hideAlertForNoBillsToExport() {
        this.renderer.removeClass(this.noBillsAlert.nativeElement, "show");
    }

    trackById(index: number, bill: Bill) {
        console.log("Track by: " + bill.id);
        return bill.id;
    }

    sendMails() {
        //this.mailerService.postAccessToken();
    }
}

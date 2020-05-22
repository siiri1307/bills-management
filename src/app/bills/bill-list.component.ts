// Component class handles data and user interactions programmatically.
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { Bill } from "./bill";
import { BillService } from "./bill.service";
import { BudgetService } from "../budget/budget.service";
import { BudgetEntry } from "../budget/budget-entry";
import { LogService } from "../shared/log.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PDFService } from "../pdfs/pdf.service";
import { saveAs } from "file-saver";
import { MatSort } from "@angular/material/sort";
import { GoogleAuthService } from "../google-auth/google-auth.service";
import { IntegerToMonthNamePipe } from "./month-name.pipe";
import * as _moment from "moment";
import { FormControl } from "@angular/forms";
import { MatDatepicker, MAT_DATE_FORMATS } from "@angular/material";
import { subscribeOn } from "rxjs/operators";

export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MMM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

const moment = _moment;
@Component({
  selector: "app-bill-list",
  templateUrl: "./bill-list.component.html",
  styleUrls: ["./bill-list.component.css"],
  providers: [
    IntegerToMonthNamePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class BillListComponent implements OnInit, AfterViewInit {
  date = new FormControl(moment());
  billsData;
  selectedBills: Array<Bill>;
  columnsToDisplay = [
    "select",
    "flat",
    "total",
    "sumToPay",
    "monthToPayFor",
    "paymentDeadline",
    "edit",
    "delete",
  ];

  expandedElement: Bill | null;
  _filterText: string;

  alert: string;
  selectedMonth: number;

  // query the template to get references to template elements and inject them to a component
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild("alertRef", { static: false }) alertRef: ElementRef;

  showSpinner: boolean = false;

  constructor(
    private billService: BillService,
    private budgetService: BudgetService,
    private logger: LogService,
    private pdfService: PDFService,
    private renderer: Renderer2,
    private googleAuthService: GoogleAuthService,
    private monthNamePipe: IntegerToMonthNamePipe
  ) {
    this.billsData = new MatTableDataSource<Bill>();
    this.fetchBills();
    this.selectedBills = new Array<Bill>();
  }

  fetchBills(): void {
    this.billService.get().subscribe((data: any) => {
      this.billsData.data = data;
    });
  }

  ngOnInit(): void {
    console.log("Doing initialization.");
    this.billsData.filterPredicate = (bill: Bill, filter: number) => {
      var filterAsNumber = +filter;
      if (filterAsNumber === 0) {
        return true;
      }
      return bill.status === filterAsNumber;
    };

    this.billsData.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.billsData.paginator = this.paginator;
    this.billsData.sortingDataAccessor = (bill: Bill, property) => {
      switch (property) {
        case "monthToPayFor":
          return moment("10-" + bill.monthToPayFor + "-" + bill.yearToPayFor);
      }
    };
  }

  updateBill(bill: Bill, comment: string): void {
    bill.sumToPay -= bill.partialPayAmount;

    bill.status = 2;

    if (bill.sumToPay === 0) {
      bill.status = 1;
    }

    const log = this.logger.log(
      "Paid " + bill.partialPayAmount + " EUR on " + new Date() + ".",
      comment
    );

    bill.logs.push(log);

    this.saveBudgetEntry(bill.partialPayAmount);

    bill.partialPayAmount = bill.sumToPay;

    this.billService.update(bill).subscribe();
  }

  saveBudgetEntry(paidAmount: number): void {
    const entry: BudgetEntry = {
      sum: paidAmount,
    };

    this.budgetService.add(entry).subscribe();
  }

  filterBills(filterValue: number): void {
    this.billsData.filter = filterValue;
  }

  downloadLogs(): void {
    this.billService.downloadLogs().subscribe((csvfile) => {
      const blob = new Blob([csvfile], { type: "text/csv" });
      const fileName = "bills.csv";
      saveAs(blob, fileName);
    });
  }

  addBillsForSelectedMonth(): void {
    let formattedMonthYear = this.date.value.format("M YYYY");
    this.billService.postBillsForSelectedMonth(formattedMonthYear).subscribe(
      (data: any) => {
        this.billsData.data = data;
      },
      (err) => {
        this.alert = err;
        this.renderer.addClass(this.alertRef.nativeElement, "show");
      }
    );
  }

  delete(bill): void {
    this.billService.remove(bill).subscribe(() => {
      this.fetchBills();
    });
  }

  hideAlert() {
    this.renderer.removeClass(this.alertRef.nativeElement, "show");
  }

  trackById(index: number, bill: Bill) {
    console.log("Track by: " + bill.id);
    return bill.id;
  }

  downloadBillsForSelectedMonthsAsPDF() {
    if (this.selectedBills.length == 0) {
      this.alert = "No bills have been selected for export.";
      this.renderer.addClass(this.alertRef.nativeElement, "show");
    } else {
      this.pdfService.getBillsZip(this.selectedBills).subscribe(
        (doc) => {
          const blob = new Blob([doc], { type: "application/zip" });
          const fileName = "test-bills.zip";
          saveAs(blob, fileName);
        },
        (err) => {
          this.alert = err;
          this.renderer.addClass(this.alertRef.nativeElement, "show");
        }
      );
    }
  }

  sendBillsWithEmail() {
    if (this.selectedBills.length == 0) {
      this.alert = "No bills have been selected for sending.";
      this.renderer.addClass(this.alertRef.nativeElement, "show");
    } else {
      this.showSpinner = true;
      this.pdfService.sendBillsWithEmail(this.selectedBills).subscribe(
        (response) => {
          this.showSpinner = false;
          this.alert = "Your email has been successfully sent.";
          this.renderer.addClass(this.alertRef.nativeElement, "show");
        },
        (err) => {
          this.showSpinner = false;
          this.alert = err;
          this.renderer.addClass(this.alertRef.nativeElement, "show");
        }
      );
      //this.googleAuthService.sendEmails().subscribe();
    }
  }

  toggleSelect(bill: Bill) {
    bill.isSelected = !bill.isSelected;
    if (bill.isSelected) {
      this.selectedBills.push(bill);
      bill.selectImage = "assets/check-mark-11-24-guacamole-green.png";
    } else {
      this.selectedBills = this.selectedBills.filter(
        (item) => item.id !== bill.id
      );
      bill.selectImage = "assets/check-mark-11-24-grey.png";
    }
  }

  edit(bill: Bill, event: any) {
    if (event.target.value === "Edit") {
      bill.canEdit = true;
      event.target.value = "Save";
      event.target.innerHTML = "Save";
    } else if (event.target.value === "Save") {
      bill.canEdit = false;
      event.target.value = "Edit";
      event.target.innerHTML = "Edit";
      bill.sumToPay = bill.total;
      bill.partialPayAmount = bill.total;
      this.billService.update(bill).subscribe();
    }
  }

  setSelectedYear(normalizedYear: _moment.Moment) {
    const formControlValue = this.date.value;
    formControlValue.year(normalizedYear.year());
    this.date.setValue(formControlValue);
  }

  setSelectedMonth(
    normalizedMonth: _moment.Moment,
    datepicker: MatDatepicker<_moment.Moment>
  ) {
    const formControlValue = this.date.value;
    formControlValue.month(normalizedMonth.month());
    this.date.setValue(formControlValue);
    datepicker.close();
  }
}

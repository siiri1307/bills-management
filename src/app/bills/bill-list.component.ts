import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
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
import { EmailService } from "../email/email.service";
import { saveAs } from "file-saver";
import { MatSort } from "@angular/material/sort";
import { IntegerToMonthNamePipe } from "./month-name.pipe";
import * as _moment from "moment";
import { FormControl, NgForm } from "@angular/forms";
import { MatDatepicker, MAT_DATE_FORMATS } from "@angular/material";

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
    trigger("fadeAlert", [
      state("visible", style({ opacity: 1 })),
      transition(":enter", [style({ opacity: 0 }), animate(600)]),
      transition(":leave", animate(600, style({ opacity: 0 }))),
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
    //"delete",
    "paid",
    "comment",
    "edit",
  ];

  alert: string = null;
  error: string = null;
  selectedMonth: number;
  showSpinner: boolean = false;
  spinnerMessage: string;
  popUpOpen: boolean = false;
  configuredEmails: string[];
  showOverlay: boolean = false;

  // query the template to get references to template elements and inject them to a component
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild("sumForm", { read: NgForm, static: false }) sumForm: NgForm;

  constructor(
    private billService: BillService,
    private budgetService: BudgetService,
    private logger: LogService,
    private emailService: EmailService
  ) {
    this.billsData = new MatTableDataSource<Bill>();
    this.fetchBills();
    this.selectedBills = new Array<Bill>();
    this.emailService.get().subscribe((emails: string) => {
      this.configuredEmails = emails.split(";");
    });
  }

  fetchBills(): void {
    this.billService.get().subscribe((data: any) => {
      this.billsData.data = data;
    });
  }

  ngOnInit(): void {
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
          let date = moment(
            bill.monthToPayFor + "-" + bill.yearToPayFor,
            "MM-YYYY"
          );
          return date;
      }
    };
  }

  setAlert(type, message, duration = 1000) {
    if (type === "error") {
      this.error = message;
      window.setTimeout(() => {
        this.error = null;
      }, duration);
    } else if (type === "alert") {
      this.alert = message;
      window.setTimeout(() => {
        this.alert = null;
      }, duration);
    }
  }

  toggleSaveButtonDisabledState(event, bill: Bill) {
    if (event < 0) {
      this.setAlert("error", "Sum cannot be negative", 2000);
      bill.saveBtnDisabled = true;
    } else if (event === null) {
      this.setAlert("error", "Sum is required.");
      bill.saveBtnDisabled = true;
    } else {
      bill.total = event;
      bill.sumToPay = event;
      bill.partialPayAmount = event;
      bill.saveBtnDisabled = false;
    }
  }

  toggleSaveButtonDisabledStatePartialPayment(event, bill: Bill) {
    if (event < 0) {
      this.setAlert("error", "Amount cannot be negative", 2000);
      bill.saveBtnDisabled = true;
    } else if (event === null) {
      this.setAlert("error", "Amount is required.");
      bill.saveBtnDisabled = true;
    } else {
      bill.partialPayAmount = event;
      bill.saveBtnDisabled = false;
    }
  }

  updateBill(bill: Bill): void {
    //make total 0 to halt payments for certain months
    if (bill.total == 0) {
      bill.sumToPay = 0;
      bill.partialPayAmount = 0;
    }

    bill.sumToPay -= bill.partialPayAmount;

    bill.status = 2;

    if (bill.sumToPay === 0) {
      bill.status = 1;
    }

    const log = this.logger.log(
      "Paid " + bill.partialPayAmount + " EUR on " + new Date() + ".",
      bill.comment
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
        this.setAlert("alert", err, 3000);
      }
    );
  }

  bulkDelete(): void {
    for (let bill of this.selectedBills) {
      this.delete(bill);
    }
  }

  delete(bill): void {
    this.billService.remove(bill).subscribe(() => {
      let deletedBillIndex = this.selectedBills.indexOf(bill);
      if (deletedBillIndex > -1) {
        this.selectedBills.splice(deletedBillIndex, 1);
      }
      this.fetchBills();
    });
  }

  hideAlert() {
    this.alert = null;
  }

  hideError() {
    this.error = null;
  }

  trackById(index: number, bill: Bill) {
    console.log("Track by: " + bill.id);
    return bill.id;
  }

  downloadBillsForSelectedMonthsAsPDF() {
    if (this.selectedBills.length == 0) {
      this.setAlert("alert", "No bills have been selected for export.", 3000);
    } else {
      this.showSpinner = true;
      this.spinnerMessage = "Fetching PDF bills ...";
      this.emailService.getBillsZip(this.selectedBills).subscribe(
        (doc) => {
          this.showSpinner = false;
          this.spinnerMessage = "";
          const blob = new Blob([doc], { type: "application/zip" });
          const fileName = "bills.zip";
          saveAs(blob, fileName);
        },
        (err) => {
          this.showSpinner = false;
          this.spinnerMessage = "";
          this.setAlert("error", err, 3000);
        }
      );
    }
  }

  openPopUp() {
    if (this.selectedBills.length == 0) {
      this.setAlert("alert", "No bills have been selected for sending.", 3000);
    } else {
      this.popUpOpen = true;
      this.showOverlay = true;
    }
  }

  onPopUpClosed(event: any) {
    this.popUpOpen = false;
    this.showOverlay = false;
  }

  sendBillsWithEmail(selectedEmails: string[]) {
    this.showOverlay = false;
    this.showSpinner = true;
    this.spinnerMessage = "Sending email ...";
    this.emailService
      .sendBillsWithEmail(this.selectedBills, selectedEmails)
      .subscribe(
        (response) => {
          this.showSpinner = false;
          this.spinnerMessage = "";
          this.setAlert(
            "alert",
            "Your email has been successfully sent.",
            3000
          );
        },
        (err) => {
          this.showSpinner = false;
          this.spinnerMessage = "";
          this.setAlert("error", err, 3000);
        }
      );
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
    if (event.target.innerHTML.trim() === "Edit") {
      bill.canEdit = true;
      event.target.value = "Save";
      event.target.innerHTML = "Save";
    } else if (event.target.innerHTML.trim() === "Save") {
      bill.canEdit = false;
      event.target.value = "Edit";
      event.target.innerHTML = "Edit";
      this.updateBill(bill);
    }
  }

  cancelEdit(bill: Bill) {
    this.billService.getBillById(bill.id).subscribe(
      (response) => {
        let billFromDb = response;
        bill.total = billFromDb.total;
        bill.sumToPay = billFromDb.sumToPay;
        bill.partialPayAmount = billFromDb.partialPayAmount;
        bill.comment = billFromDb.comment;
        let editBtn = document.getElementById("b" + bill.id);
        editBtn.innerHTML = "Edit";
        bill.canEdit = false;
        if (bill.saveBtnDisabled) {
          bill.saveBtnDisabled = false;
        }
      },
      (error) => console.log("Could not get bill by ID from DB")
    );
    bill.canEdit = false;
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

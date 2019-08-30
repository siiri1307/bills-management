import { TestBed, ComponentFixture } from "@angular/core/testing";
import { BillListComponent } from "./bill-list.component";
import { BillService } from "./bill.service";
import { BudgetService } from "../budget/budget.service";
import { LogService } from "../shared/log.service";
import { PDFService } from "../pdfs/pdf.service";
import { Renderer2 } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { IntegerToMonthNamePipe } from "./month-name.pipe";
import { BillPartialPayComponent } from "../bill-partial-pay/bill-partial-pay.component";
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";

describe('BillListComponent', () => {

    let component: BillListComponent;
    let fixture: ComponentFixture<BillListComponent>;
    let billService: BillService;
    let budgetService: BudgetService;
    let logService: LogService;
    let pdfService: PDFService;
    let renderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ BillListComponent, IntegerToMonthNamePipe, BillPartialPayComponent ],
            imports: [ MatSortModule, MatPaginatorModule, MatTableModule, FormsModule, HttpClientTestingModule, BrowserAnimationsModule ],
            providers: [ BillService, BudgetService, LogService, PDFService, Renderer2 ]
        });

        fixture = TestBed.createComponent(BillListComponent);
        component = fixture.componentInstance;
    
        billService = TestBed.get(BillService);
        budgetService = TestBed.get(BudgetService);
        logService = TestBed.get(LogService);
        pdfService = TestBed.get(PDFService);
        renderer = TestBed.get(Renderer2); 
    });

  it('clicking "Download bills for running month" should show the alert message', () => {

    component.noBillsToExportMessage = "There are no bills to export.";
    
    fixture.debugElement.nativeElement.querySelector('.download-bills').click();
    fixture.detectChanges(); //trigger a change detection
   
    expect(component.noBillsAlert).toBeDefined();
    expect(component.noBillsAlert.nativeElement.textContent).toContain("There are no bills to export.");
  })

  it('"No bills to download" alert message should not be initially shown', () => {

    expect(component.noBillsAlert).toBeUndefined();
  })

  it('"No bills to download" alert message is closed when x is clicked', () => {

    component.noBillsToExportMessage = "There are no bills to export.";
    fixture.debugElement.nativeElement.querySelector('.download-bills').click();
    fixture.detectChanges();
    expect(document.getElementsByClassName('show').length).toBe(1);

    fixture.debugElement.nativeElement.querySelector('.close').click();
    fixture.detectChanges();
    expect(document.getElementsByClassName('show').length).toBe(0);
   
  })
})

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BillPartialPayComponent } from './bill-partial-pay.component';
import { Bill } from '../bills/bill';
import { LogEntry } from '../shared/log-entry';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('BillPartialPayComponent', () => {
  let component: BillPartialPayComponent;
  let fixture: ComponentFixture<BillPartialPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BillPartialPayComponent ],
      imports: [ FormsModule, ReactiveFormsModule ]
    });
    fixture = TestBed.createComponent(BillPartialPayComponent);
    component = fixture.componentInstance;
    
    // fixture.detectChanges();
  });

  it('should propagate bill to template', () => {

    const testBill: Bill = {id: 1, number: 2, total: 110, flat: 1, sumToPay: 110, monthToPayFor: 'July', paymentDeadline: '10.08.2019', 
    partialPayAmount: 0, status: 3, logs: new Array<LogEntry>()};

    component.bill = testBill;
    fixture.detectChanges(); // trigger initial data binding

    const billDe = fixture.debugElement.query(By.css('.partial-pay'));
   
    expect(billDe.context.bill).toBe(testBill);
  });

  it('should disable the field for inputting paid amount and comment when fully paid', async(() => {
    
    // mock bill supplied by the parent component
    const testBill: Bill = {id: 1, number: 2, total: 110, flat: 1, sumToPay: 110, monthToPayFor: 'July', paymentDeadline: '10.08.2019', 
    partialPayAmount: 0, status: 1, logs: new Array<LogEntry>()};
    
    component.bill = testBill;

    // trigger initial data binding
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const paidAmountDE = fixture.debugElement.query(By.css('#paidAmount'));
      const commentDE = fixture.debugElement.query(By.css('#comment'));
      alert(paidAmountDE.nativeElement.disabled);
  
      expect(paidAmountDE.nativeElement.disabled).toBe(true);
      expect(commentDE.nativeElement.disabled).toBe(true);
    });
 
  }));

  it('should raise selected event when clicked (triggerEventHandler)', () => {
    

    const testBill: Bill = {id: 1, number: 2, total: 110, flat: 1, sumToPay: 110, monthToPayFor: 'July', paymentDeadline: '10.08.2019', 
    partialPayAmount: 0, status: 1, logs: new Array<LogEntry>()};
    
    component.bill = testBill;

    fixture.detectChanges();

    let submittedBill;

    component.submittedAmount.subscribe((bill: Bill) => submittedBill = bill);
    
    const billDe = fixture.debugElement.query(By.css('form'));

    billDe.triggerEventHandler('submit', null);

    fixture.detectChanges();

    expect(submittedBill.bill.id).toEqual(testBill.id);
    expect(submittedBill.bill.total).toEqual(testBill.total);
    expect(submittedBill.bill.flat).toEqual(testBill.flat);
    // expect(submittedBill.total).toEqual(110);
  
  });

});

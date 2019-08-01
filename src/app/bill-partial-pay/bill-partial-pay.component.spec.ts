import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BillPartialPayComponent } from './bill-partial-pay.component';
import { Bill } from '../bills/bill';
import { LogEntry } from '../shared/log-entry';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('BillPartialPayComponent', () => {
  let component: BillPartialPayComponent;
  let fixture: ComponentFixture<BillPartialPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BillPartialPayComponent ],
      imports: [ FormsModule ]
    });
    fixture = TestBed.createComponent(BillPartialPayComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should propagate bill to template', () => {

    const testBill: Bill = {id: 1, total: 110, flat: 1, sumToPay: 110, monthToPayFor: 'July', paymentDeadline: '10.08.2019', 
    partialPayAmount: 0, status: 3, logs: new Array<LogEntry>()};

    component.bill = testBill;
    fixture.detectChanges(); //trigger initial data binding

    let billDe = fixture.debugElement.query(By.css('.partial-pay'));
   
    expect(billDe.context.bill).toBe(testBill);
  });

  it('should disable the field for inputting paid amount and comment when fully paid',async(() => {

    const testBill: Bill = {id: 1, total: 110, flat: 1, sumToPay: 110, monthToPayFor: 'July', paymentDeadline: '10.08.2019', 
    partialPayAmount: 0, status: 1, logs: new Array<LogEntry>()};
    
    component.bill = testBill;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      let paidAmountDE = fixture.debugElement.query(By.css('#paidAmount'));
      let commentDE = fixture.debugElement.query(By.css('#comment'));
      alert(paidAmountDE.nativeElement.disabled);
  
      expect(paidAmountDE.nativeElement.disabled).toBe(true);
      expect(commentDE.nativeElement.disabled).toBe(true);
    });
 
  }));
  
  /*
  it('raises the selected event when clicked', () => {
    const myBill: Bill = {id: 1, total: 110, flat: 1, sumToPay: 110, monthToPayFor: 'July', paymentDeadline: '10.08.2019', 
    partialPayAmount: 0, status: 3, logs: new Array<LogEntry>()};

    const myComment: string = 'This is test comment.';
    component.bill = myBill;
    fixture.detectChanges();

    let billDe = fixture.debugElement.query(By.css('.partial-pay'));

    let amendedBill: Bill;
    component.submitPaidAmount.subscribe((bill: Bill) => amendedBill = bill);
    billDe.triggerEventHandler('click', null);
    expect(amendedBill).toBe(myBill);

    //let billDe = fixture.debugElement.query(By.css('.partial-pay')).nativeElement;
    //alert(billDe.comment);
    //expect(billDe.id).toEqual(myBill.id);

    //spyOn(component.submitPaidAmount, 'emit');
    //component.submitForm(myBill, myComment);
    //expect(component.submitPaidAmount.emit).toHaveBeenCalledWith(myBill, myComment);

    //component.submitPaidAmount.subscribe({selectedBill: Bill, selectedComment: string} => expect({selectedBill: Bill, selectedComment: string}).toEqual({myBill: Bill, myComment: string}));
    //component.submitForm(myBill, myComment);
    //expect(component).toBeTruthy();
  });*/


});

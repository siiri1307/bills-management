import { Component, OnInit, Input } from '@angular/core';
import { Bill } from '../bills/bill';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bill-partial-pay',
  templateUrl: './bill-partial-pay.component.html',
  styleUrls: ['./bill-partial-pay.component.css']
})
export class BillPartialPayComponent implements OnInit {

  @Input() bill: Bill;
  @Output() submitPaidAmount = new EventEmitter<{bill: Bill, comment: string}>();

  constructor() { }

  ngOnInit() {}

  submitForm(bill: Bill, comment: string){
    this.submitPaidAmount.emit({bill, comment});
  }

}

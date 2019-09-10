import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Bill } from './bill';

@Pipe({
    name: 'searchBillsByMonth'
})

@Injectable()
export class SearchBillsByMonthPipe implements PipeTransform {
    transform(bills: Bill[], filter: string): any[] {
        if (!filter || filter.length === 0) {
            return bills;
        }
        
        return bills.filter(bill => bill.monthToPayFor.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }
}

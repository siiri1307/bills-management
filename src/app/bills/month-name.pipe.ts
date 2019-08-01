import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'toMonthName'
})

export class IntegerToMonthNamePipe implements PipeTransform {
    transform(monthAsNumber: number): string {

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

        return monthNames[monthAsNumber-1];
    }
}
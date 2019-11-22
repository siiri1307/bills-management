import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'toMonthName'
})

export class IntegerToMonthNamePipe implements PipeTransform {
    //supports 1-based (backend requirement)
    transform(monthAsNumber: number): string {

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

        return monthNames[monthAsNumber - 1];
    }
}

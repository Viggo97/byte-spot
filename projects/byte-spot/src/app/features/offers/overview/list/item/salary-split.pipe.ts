import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'salarySplit'})
export class SalarySplitPipe implements PipeTransform {
    transform(value: number): string {
        if (value < 1000) {
            return value.toString();
        }

        if (value % 1000 !== 0) {
            return (value / 1000).toFixed(1) + 'k';
        }

        return (value / 1000).toString() + 'k';
    }
}

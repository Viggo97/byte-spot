import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormatter',
    standalone: true,
})
export class NumberFormatterPipe implements PipeTransform {
    transform(value: number): string {
        const numStr = value.toString();

        if (!Number.isInteger(value)) {
            return numStr;
        }

        if (numStr.length <= 3) {
            return numStr;
        }

        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

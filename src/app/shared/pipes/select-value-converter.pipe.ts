import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'selectValueConverter',
    standalone: true,
})
export class SelectValueConverterPipe implements PipeTransform {
    transform(value: unknown, label?: string): string {
        if (!value) {
            return '';
        }
        if (value && typeof value === 'object' && label) {
            if (label in value) {
                return value[label as keyof typeof value];
            }
            throw new Error('Provided label is incorrect');
        }
        return value.toString();
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'listBoxOptionValueConverter'})
export class ListBoxOptionValueConverterPipe implements PipeTransform {

    transform(value: unknown, bindLabel?: string): string {
        if (!value) {
            return '';
        }

        if (typeof value === 'string') {
            return value;
        }

        if (typeof value === 'number') {
            return value.toString();
        }

        if (typeof value === 'object' && bindLabel) {
            if (bindLabel in value) {
                return value[bindLabel as keyof typeof value];
            }
            throw new Error('Provided label is incorrect');
        }
        throw new Error('Cannot parse the value');
    }
}

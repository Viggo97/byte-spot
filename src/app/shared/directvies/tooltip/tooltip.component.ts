import { Component } from '@angular/core';

@Component({
    selector: 'bsa-tooltip',
    standalone: true,
    imports: [],
    template: '{{ message }}',
    styles: '',
})
export class TooltipComponent {
    message: string | undefined;
}

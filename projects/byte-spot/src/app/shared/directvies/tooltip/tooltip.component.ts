import { Component } from '@angular/core';

@Component({
    selector: 'bsa-tooltip',
    imports: [],
    template: '{{ message }}',
    styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
    message: string | undefined;
}

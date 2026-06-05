import { Directive } from '@angular/core';

@Directive({
    selector: '[bslMenuItem]',
    host: {
        '[attr.role]': '"menuitem"',
        'tabindex': '-1',
    },
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MenuItemDirective {}

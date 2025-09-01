import { Component, input } from '@angular/core';

@Component({
    selector: 'ngx-bsa-label',
    imports: [],
    template: '<ng-content></ng-content>',
    host: {'[attr.id]': 'id()'},
})
export class LabelComponent {
    id = input.required<string>();
}

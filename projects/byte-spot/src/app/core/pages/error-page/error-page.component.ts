import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../translate/translate.pipe';

@Component({
    selector: 'bsa-error-page',
    imports: [
        RouterLink,
        TranslatePipe,
    ],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ErrorPageComponent {}

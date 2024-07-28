import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';

import { OfferSearchDrawerComponent } from './offer-search-drawer/offer-search-drawer.component';
import { OfferSearchDropdownComponent } from './offer-search-dropdown/offer-search-dropdown.component';

@Component({
    selector: 'bsa-offer-search',
    standalone: true,
    imports: [
        AsyncPipe,
        OfferSearchDropdownComponent,
        OfferSearchDrawerComponent,
    ],
    templateUrl: './offer-search.component.html',
    styleUrl: './offer-search.component.scss',
})
export class OfferSearchComponent {
    searchPhrase = '';
    dropdownMode = this.breakpointObserver.observe('(min-width: 960px)');

    constructor(
        private breakpointObserver: BreakpointObserver,
    ) {}
}

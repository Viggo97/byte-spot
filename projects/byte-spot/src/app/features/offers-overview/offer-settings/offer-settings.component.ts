import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OfferSettingsSortComponent } from './offer-settings-sort/offer-settings-sort.component';
import { OfferSettingsResultsComponent } from './offer-settings-results/offer-settings-results.component';
import { OfferSort } from '../enums/offer-sort.enum';

@Component({
    selector: 'bsa-offer-settings',
    imports: [
        OfferSettingsSortComponent,
        OfferSettingsResultsComponent,
    ],
    templateUrl: './offer-settings.component.html',
    styleUrl: './offer-settings.component.scss',
})
export class OfferSettingsComponent {
    @Input() sort?: OfferSort;
    @Input() offersNumber = 0;

    @Output() sortChange = new EventEmitter<OfferSort>();

    onSortChange(sortType: OfferSort): void {
        this.sortChange.emit(sortType);
    }
}

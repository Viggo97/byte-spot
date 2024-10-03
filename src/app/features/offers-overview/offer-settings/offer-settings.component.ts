import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslatePipe } from '@core';
import { NumberFormatterPipe } from '@shared';
import { OfferSettingsSortComponent } from './offer-settings-sort/offer-settings-sort.component';
import { OfferSettingsResultsComponent } from './offer-settings-results/offer-settings-results.component';
import { OfferSort } from '../enums/offer-sort.enum';

@Component({
    selector: 'bsa-offer-settings',
    standalone: true,
    imports: [
        TranslatePipe,
        NumberFormatterPipe,
        OfferSettingsSortComponent,
        OfferSettingsResultsComponent,
    ],
    templateUrl: './offer-settings.component.html',
    styleUrl: './offer-settings.component.scss',
})
export class OfferSettingsComponent {
    @Input() sort?: OfferSort;
    @Output() sortChange = new EventEmitter<OfferSort>();

    onSortChange(sortType: OfferSort): void {
        this.sortChange.emit(sortType);
    }
}

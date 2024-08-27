import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';

import { TranslatePipe } from '@core';
import { NumberFormatterPipe } from '@shared';
import { OfferSettingsSortComponent } from './offer-settings-sort/offer-settings-sort.component';
import { OfferSettingsFiltersComponent } from './offer-settings-filters/offer-settings-filters.component';
import { OfferSettingsResultsComponent } from './offer-settings-results/offer-settings-results.component';

@Component({
    selector: 'bsa-offer-settings',
    standalone: true,
    imports: [
        TranslatePipe,
        NumberFormatterPipe,
        OfferSettingsSortComponent,
        OfferSettingsFiltersComponent,
        OfferSettingsResultsComponent,
    ],
    templateUrl: './offer-settings.component.html',
    styleUrl: './offer-settings.component.scss',
})
export class OfferSettingsComponent {
    private breakpointObserver = inject(BreakpointObserver);
    filters = false;

    constructor() {
        // TODO Consider moving this logic to offers overview and pass relevant flag as input
        // to avoid duplicated subs
        this.breakpointObserver
            .observe('(min-width: 960px)')
            .pipe(takeUntilDestroyed())
            .subscribe((state) => {
                this.filters = !state.matches;
            });
    }
}

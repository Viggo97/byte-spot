import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';

import { TranslatePipe, TranslateService } from '@core';
import { DrawerComponent, NumberFormatterPipe, SelectComponent } from '@shared';
import { OfferFiltersComponent } from '@app/features/offers-overview/offer-filters/offer-filters.component';
import { SortType } from './offer-sort.enum';

type SortOption = {
    key: string;
    label: string
};

@Component({
    selector: 'bsa-offer-settings',
    standalone: true,
    imports: [
        FormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        NumberFormatterPipe,
        SelectComponent,
        DrawerComponent,
        OfferFiltersComponent,
    ],
    templateUrl: './offer-settings.component.html',
    styleUrl: './offer-settings.component.scss',
})
export class OfferSettingsComponent {
    private translateService = inject(TranslateService);
    private breakpointObserver = inject(BreakpointObserver);
    private overlay = inject(Overlay);
    readonly scrollStrategy = this.overlay.scrollStrategies.block();

    offers = 12399999;

    sortDropdownWidth: 'auto' | undefined;
    sort: SortOption;
    sortOptions: SortOption[] = [
        {
            key: SortType.NEWEST,
            label: this.translateService.translate('offer.newest'),
        },
        {
            key: SortType.HIGHEST_SALARY,
            label: this.translateService.translate('offer.highestSalary'),
        },
        {
            key: SortType.LOWEST_SALARY,
            label: this.translateService.translate('offer.lowestSalary'),
        },
    ];

    drawerOpen = false;
    @ViewChild(DrawerComponent) drawer!: DrawerComponent;

    constructor() {
        [this.sort] = this.sortOptions;
        this.breakpointObserver
            .observe('(min-width: 600px)')
            .pipe(takeUntilDestroyed())
            .subscribe((state) => {
                this.sortDropdownWidth = state.matches ? 'auto' : undefined;
            });
    }

    openDrawer(): void {
        this.drawerOpen = true;
    }

    closeDrawer(): void {
        this.drawerOpen = false;
    }
}

import { Component, inject, signal } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { DrawerComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { FiltersService } from '../filters.service';
import { FiltersFormComponent } from '../form/filters-form.component';
import { FiltersFormService } from '../form/filters-form.service';

@Component({
    selector: 'bsa-offers-overview-filters-view-compact',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        DrawerComponent,
        TranslatePipe,
        FiltersFormComponent,
    ],
    templateUrl: './filters-view-compact.component.html',
    styleUrl: './filters-view-compact.component.scss',
})
export class FiltersViewCompactComponent {
    private overlay = inject(Overlay);
    private filtersService = inject(FiltersService);
    private filtersFormService = inject(FiltersFormService);

    protected readonly scrollStrategy = this.overlay.scrollStrategies.block();

    protected drawerOpen = signal(false);

    protected openDrawer(): void {
        this.drawerOpen.set(true);
    }

    protected closeDrawer(): void {
        this.drawerOpen.set(false);
    }

    protected resetFilters(): void {
        this.filtersFormService.form.reset();
    }

    protected changeFilters(): void {
        this.filtersService.changeFilters();
        this.closeDrawer();
    }
}

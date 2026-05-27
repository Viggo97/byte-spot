import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, skip } from 'rxjs';
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
export class FiltersViewCompactComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    private overlay = inject(Overlay);
    private filtersService = inject(FiltersService);
    private filtersFormService = inject(FiltersFormService);

    protected readonly scrollStrategy = this.overlay.scrollStrategies.block();

    protected drawerOpen = signal(false);

    private salaryFilterChange = toObservable(this.filtersFormService.salaryFilter)
        .pipe(
            skip(1),
            debounceTime(300),
            takeUntilDestroyed(this.destroyRef),
        );
    private collectionFiltersChange = toObservable(this.filtersFormService.collectionFilters)
        .pipe(
            skip(1),
            takeUntilDestroyed(this.destroyRef),
        );

    ngOnInit(): void {
        this.subscribeToFormChanges();
    }

    protected openDrawer(): void {
        this.drawerOpen.set(true);
    }

    protected closeDrawer(): void {
        this.drawerOpen.set(false);
    }

    protected resetFilters(): void {
        this.filtersService.resetFiltersForm();
    }

    private subscribeToFormChanges(): void {
        this.salaryFilterChange
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
        this.collectionFiltersChange
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
    }
}

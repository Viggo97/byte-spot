import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, merge } from 'rxjs';
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

    protected filtersInitialized = toSignal(this.filtersService.filtersInitialized$);
    protected drawerOpen = signal(false);

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
        this.filtersFormService.form.reset();
    }

    private subscribeToFormChanges(): void {
        this.filtersFormService.form.controls.salary.valueChanges
            .pipe(
                debounceTime(300),
                takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
        merge(
            this.filtersFormService.form.controls.workMode.valueChanges,
            this.filtersFormService.form.controls.employmentType.valueChanges,
            this.filtersFormService.form.controls.seniority.valueChanges,
            this.filtersFormService.form.controls.technologies.valueChanges,
            this.filtersFormService.form.controls.locations.valueChanges,
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
    }
}

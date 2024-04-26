import { Component, OnDestroy, OnInit } from '@angular/core';
import { Breakpoints } from '@app/core/enums/breakpoints/breakpoints.enum';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { SearchDrawerComponent } from '@app/features/offers-overview/components/search-drawer/search-drawer.component';
import { DrawerService } from '@app/shared/services/drawer/drawer.service';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'bsa-filters',
    standalone: true,
    imports: [
        SearchComponent,
    ],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
    resize$ = fromEvent(window, 'resize');
    filterButtonsVisible = window.innerWidth < Breakpoints.SM;

    private destroy$ = new Subject<void>();

    constructor(private drawerService: DrawerService) {
    }

    ngOnInit(): void {
        this.initFilterIconsHandling();
    }

    private initFilterIconsHandling(): void {
        this.resize$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.filterButtonsVisible = window.innerWidth < Breakpoints.SM;
                if (window.innerWidth > Breakpoints.SM) {
                    this.drawerService.closeDrawer();
                }
            });
    }

    onSearchDrawerOpen(): void {
        this.drawerService.openDrawer(SearchDrawerComponent);
    }

    onTechnologyDrawerOpen(): void {}

    onFiltersDrawerOpen(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

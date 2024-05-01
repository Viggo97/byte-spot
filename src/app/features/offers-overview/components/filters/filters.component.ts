import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import {
    Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { Breakpoints } from '@app/core/enums/breakpoints/breakpoints.enum';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'bsa-filters',
    standalone: true,
    imports: [
        SearchComponent,
        DrawerComponent,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
    ],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
    protected scrollStrategy = this.overlay.scrollStrategies.block();
    private resize$ = fromEvent(window, 'resize');
    protected filterButtonsVisible = window.innerWidth < Breakpoints.SM;

    protected searchOpen = false;
    protected technologyOpen = false;
    protected filtersOpen = false;

    @ViewChild('searchDrawer') searchDrawer!: DrawerComponent;

    private destroy$ = new Subject<void>();

    constructor(private overlay: Overlay) {
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
                    this.searchOpen = false;
                    this.technologyOpen = false;
                    this.filtersOpen = false;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

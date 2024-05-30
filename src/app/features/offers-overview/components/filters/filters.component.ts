import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import {
    Component, OnDestroy, OnInit, ViewChild,
} from '@angular/core';
import { Breakpoints } from '@app/core/enums/breakpoints/breakpoints.enum';
import { LayoutService } from '@app/core/services/layout/layout.service';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { SearchDrawerComponent } from '@app/features/offers-overview/components/search-drawer/search-drawer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'bsa-filters',
    standalone: true,
    imports: [
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        SearchComponent,
        SearchDrawerComponent,
    ],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
    protected scrollStrategy = this.overlay.scrollStrategies.block();
    protected filterButtonsVisible = window.innerWidth < Breakpoints.SM;

    protected searchOpen = false;
    protected technologyOpen = false;
    protected filtersOpen = false;

    @ViewChild(SearchDrawerComponent) searchDrawer!: SearchDrawerComponent;

    private destroy$ = new Subject<void>();

    constructor(
        private overlay: Overlay,
        private layoutService: LayoutService,
    ) {}

    ngOnInit(): void {
        this.initFilterIconsHandling();
    }

    private initFilterIconsHandling(): void {
        this.layoutService.observe()
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

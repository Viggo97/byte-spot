import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';

import { PaginationComponent } from '@shared';

import { PaginationParams } from '@app/features/offers-overview/types/pagination-params';
import { OffersService } from './offers.service';
import { OfferFiltersComponent } from './offer-filters/offer-filters.component';
import { OfferSearchComponent } from './offer-search/offer-search.component';
import { OfferSettingsComponent } from './offer-settings/offer-settings.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferPost } from './interfaces/offer-post.interface';
import { OfferSort } from './enums/offer-sort.enum';

@Component({
    selector: 'bsa-offers-overview',
    standalone: true,
    imports: [
        PaginationComponent,
        OfferFiltersComponent,
        OfferSearchComponent,
        OfferListComponent,
        OfferSettingsComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
})
export class OffersOverviewComponent implements OnInit {
    private breakpointObserver = inject(BreakpointObserver);
    private offersService = inject(OffersService);

    compactMode = window.innerWidth < 960;

    offersParams$ = new BehaviorSubject<void>(undefined);
    offers$!: Observable<OfferPost[]>;
    sort: OfferSort = OfferSort.NEWEST;
    pagination: PaginationParams = {
        limit: 5,
        page: 1,
    };
    total = 0;
    searchTerm = '';

    constructor() {
        this.breakpointObserver.observe('(min-width: 960px)').subscribe((state) => {
            this.compactMode = !state.matches;
        });
    }

    ngOnInit(): void {
        this.offers$ = this.offersParams$.asObservable()
            .pipe(
                switchMap(() => this.offersService.getOffers(this.sort, this.pagination, this.searchTerm)),
                tap((offerList) => {
                    this.total = offerList.total;
                }),
                map((offerList) => offerList.offers),
            );
    }

    onSortChange(offerSort: OfferSort): void {
        this.sort = offerSort;
        this.offersParams$.next();
    }

    onPageChange(page: number): void {
        this.pagination.page = page;
        this.offersParams$.next();
    }

    onSearch(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.offersParams$.next();
    }
}

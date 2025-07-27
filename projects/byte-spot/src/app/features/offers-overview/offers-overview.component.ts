import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';

import { PaginationComponent } from '@shared';

import { OffersService } from './offers.service';
import { OfferFiltersComponent } from './offer-filters/offer-filters.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferSearchComponent } from './offer-search/offer-search.component';
import { OfferSettingsComponent } from './offer-settings/offer-settings.component';
import { OfferPost } from './interfaces/offer-post.interface';
import { OfferSort } from './enums/offer-sort.enum';
import { OfferFilters } from './offer-filters/offer-filters.model';
import { PaginationParams } from './types/pagination-params';

@Component({
    selector: 'bsa-offers-overview',
    imports: [
        PaginationComponent,
        OfferFiltersComponent,
        OfferListComponent,
        OfferSearchComponent,
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
        limit: 10,
        page: 1,
    };
    total = 0;
    searchTerm = '';
    filters: OfferFilters | null = null;
    offersLoading = true;

    constructor() {
        this.breakpointObserver.observe('(min-width: 960px)').subscribe((state) => {
            this.compactMode = !state.matches;
        });
    }

    ngOnInit(): void {
        this.offers$ = this.offersParams$.asObservable()
            .pipe(
                tap(() => {
                    this.offersLoading = true;
                }),
                switchMap(() => this.offersService.getOffers(
                    this.sort,
                    this.pagination,
                    this.searchTerm,
                    this.filters,
                )),
                tap((offerList) => {
                    this.total = offerList.total;
                    this.offersLoading = false;
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

    onFiltersChange(filters: OfferFilters): void {
        this.filters = filters;
        this.offersParams$.next();
    }

    protected readonly location = location;
}

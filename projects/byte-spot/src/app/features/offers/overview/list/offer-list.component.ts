import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@core';
import { PaginationComponent } from 'ngx-bsl';
import { ListService } from './list.service';
import { PaginationService } from './pagination.service';
import { Offer } from './models/offer.interface';
import { OfferListItemComponent } from './item/offer-list-item.component';
import { OfferListSkeletonComponent } from './skeleton/offer-list-skeleton.component';

@Component({
    selector: 'bsa-offer-list',
    imports: [
        OfferListItemComponent,
        OfferListSkeletonComponent,
        TranslatePipe,
        PaginationComponent,
    ],
    templateUrl: './offer-list.component.html',
    styleUrl: './offer-list.component.scss',
})
export class OfferListComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _listService = inject(ListService);
    private readonly _paginationService = inject(PaginationService);

    protected offers = signal<Offer[]>([]);
    protected skeletons = signal([...Array(this._paginationService.limit).keys()]);
    protected loading = toSignal(this._listService.fetchingOffers$);
    protected page = this._paginationService.page;
    protected total = this._paginationService.total;
    protected limit = this._paginationService.limit;

    ngOnInit(): void {
        this._listService.offers$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(offers => {
                if (offers) {
                    this.offers.set(offers.items);
                    this.total.set(offers.totalCount);
                    this.skeletons.set([...Array(offers.items.length || this._paginationService.limit).keys()]);
                } else {
                    this.skeletons.set([...Array(this._paginationService.limit).keys()]);
                }
            });
    }

    protected onPageChange(): void {
        this._paginationService.changePagination();
    }
}

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
    private destroyRef = inject(DestroyRef);
    private listService = inject(ListService);
    private paginationService = inject(PaginationService);

    protected offers = signal<Offer[]>([]);
    protected skeletons = signal([...Array(this.paginationService.limit).keys()]);
    protected loading = toSignal(this.listService.fetchingOffers$);
    protected page = this.paginationService.page;
    protected total = this.paginationService.total;
    protected limit = this.paginationService.limit;

    ngOnInit(): void {
        this.listService.offers$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(offers => {
                this.offers.set(offers.items);
                this.total.set(offers.totalCount);
                this.skeletons.set([...Array(offers.items.length || this.paginationService.limit).keys()]);
            });
    }

    protected onPageChange(): void {
        this.paginationService.changePagination();
    }
}

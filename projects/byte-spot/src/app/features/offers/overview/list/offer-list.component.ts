import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListService } from './list.service';
import { OfferPost } from './models/offer-post.interface';
import { OfferListItemComponent } from './item/offer-list-item.component';
import { OfferListSkeletonComponent } from './skeleton/offer-list-skeleton.component';
import { TranslatePipe } from '@core';
import { PaginationComponent } from 'ngx-bsl';

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

    protected offers = signal<OfferPost[]>([]);
    protected skeletons = signal([...Array(3).keys()]);
    protected loading = signal(true);
    protected page = signal(1);
    protected total = signal(0);

    ngOnInit(): void {
        this.listService.getOffers()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(data => {
                this.offers.set(data);
                this.total.set(data.length);
                this.loading.set(false);
            });
    }

    protected onPageChange(page: number): void {

    }
}

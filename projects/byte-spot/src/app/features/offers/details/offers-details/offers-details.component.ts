import { Component, DestroyRef, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoaderComponent } from '@shared';
import { ActionComponent } from './action/action.component';
import { DeadlineComponent } from './deadline/deadline.component';
import { DescriptionComponent } from './description/description.component';
import { InfoComponent } from './info/info.component';
import { TitleComponent } from './title/title.component';
import { OfferDetailsDataService } from './offer-details-data.service';
import { OfferDetails } from './models/offer-details.interface';

@Component({
    selector: 'bsa-offers-details',
    imports: [
        ActionComponent,
        DeadlineComponent,
        DescriptionComponent,
        InfoComponent,
        TitleComponent,
        LoaderComponent,
    ],
    templateUrl: './offers-details.component.html',
    styleUrl: './offers-details.component.scss',
    providers: [
        OfferDetailsDataService,
    ],
})
export class OffersDetailsComponent implements OnInit {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _detailsService = inject(OfferDetailsDataService);

    protected compactMode = signal(window.innerWidth < 960);

    protected offerId?: string;
    protected offer = signal<OfferDetails | null>(null);
    protected expired = computed(() => {
        const validTo = this.offer()?.validTo;
        if (!validTo) return false;
        return new Date(validTo) < new Date();
    });

    constructor() {
        this.subscribeToBreakpointObserver();
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe(params => {
            const id = params['id'] as string | undefined;
            if (!id) {
                void this._router.navigate(['/offers']);
            }
            this.offerId = id;
        });

        this._detailsService.getOfferDetails(this.offerId as string)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(offer => {
                this.offer.set(offer);
            });
    }

    private subscribeToBreakpointObserver(): void {
        this._breakpointObserver.observe('(min-width: 960px)')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((state) => {
                this.compactMode.set(!state.matches);
            });
    }
}

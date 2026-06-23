import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, UserService } from '@core';
import { EmployerDataService } from '../employer-data.service';
import { OfferApplication } from './models/offer-application.interface';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '@shared';
import { SkeletonComponent } from '@byte-spot-lib';

@Component({
    selector: 'bsa-employer-offers',
    imports: [
        RouterLink,
        SkeletonComponent,
        SvgIconComponent,
        TranslatePipe,
    ],
    templateUrl: './offers.component.html',
    styleUrl: './offers.component.scss',
})
export class EmployerOffersComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _userService = inject(UserService);
    private readonly user = toSignal(this._userService.user$);
    private readonly _employerDataService = inject(EmployerDataService);

    protected companyId = computed(() => this.user()?.companyId ?? '');

    protected offers = signal<OfferApplication[]>([]);
    protected loading = signal(true);

    ngOnInit(): void {
        this.fetchOffers();
    }

    private fetchOffers(): void {
        this._employerDataService
            .getOffers(this.companyId())
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(value => {
                this.offers.set(value);
                this.loading.set(false);
            });
    }
}

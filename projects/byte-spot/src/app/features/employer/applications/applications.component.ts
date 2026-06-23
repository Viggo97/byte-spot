import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SkeletonComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { EmployerDataService } from '../employer-data.service';
import { Application } from './models/application.interface';
import { OfferMinimal } from './models/offer-minimal.interface';

@Component({
    selector: 'bsa-employer-applications',
    imports: [
        SkeletonComponent,
        TranslatePipe,
    ],
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss',
})
export class EmployerApplicationsComponent implements OnInit  {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _route = inject(ActivatedRoute);
    private readonly _employerDataService = inject(EmployerDataService);

    protected applications = signal<Application[]>([]);
    protected offer = signal<OfferMinimal | null>(null);
    protected loading = signal(true);

    ngOnInit(): void {
        this.fetchApplications();
    }

    private fetchApplications(): void {
        const offerId = this._route.snapshot.paramMap.get('offerId') as string;
        if (!offerId) {
            this.loading.set(false);
            return;
        }

        forkJoin([
            this._employerDataService.getApplications(offerId),
            this._employerDataService.getOffer(offerId),
        ]).subscribe(([applications, offer]) => {
            this.applications.set(applications);
            this.offer.set(offer);
            this.loading.set(false);
        });
    }
}

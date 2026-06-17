import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkeletonComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { LoaderComponent, SvgIconComponent } from '@shared';
import { OfferCreateService } from './create.service';
import { OffersCreateBaseComponent } from './base/base.component';
import { OffersCreateCompetencesComponent } from './competences/competences.component';
import { OfferCreateContractComponent } from './contract/contract.component';
import { OfferCreateDescriptionComponent } from './description/description.component';
import { OfferCreateSaveService } from '@app/features/offers/create/create-save.service';
import { CreateOfferDto } from '@app/features/offers/create/create-offer-dto.model';

@Component({
    selector: 'bsa-offers-create',
    imports: [
        SkeletonComponent,
        TranslatePipe,
        OffersCreateBaseComponent,
        OffersCreateCompetencesComponent,
        OfferCreateContractComponent,
        OfferCreateDescriptionComponent,
        LoaderComponent,
        NgTemplateOutlet,
        SvgIconComponent,
        RouterLink,
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
    providers: [OfferCreateService, OfferCreateSaveService],
})
export class OffersCreateComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _createService = inject(OfferCreateService);
    private readonly _createSaveService = inject(OfferCreateSaveService);

    protected loading = signal(true);
    protected submitting = signal(false);
    protected added = signal(false);
    protected skeletons = signal([...Array(3).keys()]);

    baseComponent = viewChild.required(OffersCreateBaseComponent);
    competencesComponent = viewChild.required(OffersCreateCompetencesComponent);
    contractsComponent = viewChild.required(OfferCreateContractComponent);
    descriptionComponent = viewChild.required(OfferCreateDescriptionComponent);

    ngOnInit(): void {
        this._createService.fetchedCompleted$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this.loading.set(false);
            });
    }

    protected onSubmit(): void {
        this.submitting.set(true);
        const baseData = this.baseComponent().getDto();
        const competencesData = this.competencesComponent().getDto();
        const contractsData = this.contractsComponent().getDto();
        const descriptionData = this.descriptionComponent().getDto();
        const offerCreateDto = CreateOfferDto.create(baseData, competencesData, contractsData, descriptionData);

        this._createSaveService.save(offerCreateDto)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this.submitting.set(false);
                this.added.set(true);
            });
    }
}

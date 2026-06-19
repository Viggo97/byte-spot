import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { LookupItem } from '@shared';
import { OfferAttributesService } from '@app/features/offers/shared/offer-attributes.service';
import { Technology } from '@app/features/offers/overview/filters/models/technology.interface';

@Injectable()
export class OfferCreateService {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _offerAttributes = inject(OfferAttributesService);

    private _technologies: Technology[] | null = null;
    private _locations: LookupItem[] | null = null;
    private _workModes: LookupItem[] | null = null;
    private _experienceLevels: LookupItem[] | null = null;
    private _employmentTypes: LookupItem[] | null = null;

    get technologies(): Technology[] {
        if (!this._technologies) return [];
        return [...this._technologies];
    }

    get locations(): LookupItem[] {
        if (!this._locations) return [];
        return [...this._locations];
    }

    get workModes(): LookupItem[] {
        if (!this._workModes) return [];
        return [...this._workModes];
    }

    get experienceLevels(): LookupItem[] {
        if (!this._experienceLevels) return [];
        return [...this._experienceLevels];
    }

    get employmentTypes(): LookupItem[] {
        if (!this._employmentTypes) return [];
        return [...this._employmentTypes];
    }

    private fetchedCompleted = new BehaviorSubject<boolean>(false);
    fetchedCompleted$ = this.fetchedCompleted.asObservable();

    constructor() {
        this.fetchData();
    }

    private fetchData(): void {
        forkJoin([
            this._offerAttributes.getTechnologies(),
            this._offerAttributes.getLocations(),
            this._offerAttributes.getWorkModes(),
            this._offerAttributes.getExperienceLevels(),
            this._offerAttributes.getEmploymentTypes(),
        ])
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(([technologies, locations, workModes, experienceLevels, employmentTypes]) => {
                this._technologies = technologies;
                this._locations = locations;
                this._workModes = workModes;
                this._experienceLevels = experienceLevels;
                this._employmentTypes = employmentTypes;
                this.fetchedCompleted.next(true);
            });
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { LookupItem } from '@app/shared/models/lookup-item.interface';
import { Technology } from '../models/technology.interface';

@Injectable({providedIn: 'root'})
export class FiltersDataService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    private technologies: Observable<Technology[]> | null = null;
    private locations: Observable<LookupItem[]> | null = null;
    private workModes: Observable<LookupItem[]> | null = null;
    private experienceLevels: Observable<LookupItem[]> | null = null;
    private employmentTypes: Observable<LookupItem[]> | null = null;

    getTechnologies(): Observable<Technology[]> {
        const url = this.URL + '/technologies';
        this.technologies ??= this._http.get<Technology[]>(url)
            .pipe(shareReplay(1));

        return this.technologies;
    }

    getLocations(): Observable<LookupItem[]> {
        const url = this.URL + '/locations';
        this.locations ??= this._http.get<LookupItem[]>(url)
            .pipe(shareReplay(1));

        return this.locations;
    }

    getWorkModes(): Observable<LookupItem[]> {
        const url = this.URL + '/work-modes';
        this.workModes ??= this._http.get<LookupItem[]>(url).pipe(shareReplay(1));

        return this.workModes;
    }

    getExperienceLevels(): Observable<LookupItem[]> {
        const url = this.URL + '/experience-levels';
        this.experienceLevels ??= this._http.get<LookupItem[]>(url).pipe(shareReplay(1));

        return this.experienceLevels;
    }

    getEmploymentTypes(): Observable<LookupItem[]> {
        const url = this.URL + '/employment-types';
        this.employmentTypes ??= this._http.get<LookupItem[]>(url).pipe(shareReplay(1));

        return this.employmentTypes;
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { LookupItem } from '@app/shared/models/lookup-item.interface';
import { Technology } from '../models/technology.interface';

@Injectable()
export class FiltersDataService {
    private readonly http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getTechnologies(): Observable<Technology[]> {
        const url = this.URL + '/technologies';
        return this.http.get<Technology[]>(url);
    }

    getLocations(): Observable<LookupItem[]> {
        const url = this.URL + '/locations';
        return this.http.get<LookupItem[]>(url);
    }

    getWorkModes(): Observable<LookupItem[]> {
        const url = this.URL + '/work-modes';
        return this.http.get<LookupItem[]>(url);
    }

    getExperienceLevels(): Observable<LookupItem[]> {
        const url = this.URL + '/experience-levels';
        return this.http.get<LookupItem[]>(url);
    }

    getEmploymentTypes(): Observable<LookupItem[]> {
        const url = this.URL + '/employment-types';
        return this.http.get<LookupItem[]>(url);
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { Location } from '../models/location.interface';
import { Technology } from '../models/technology.interface';

@Injectable()
export class FiltersDataService {
    private readonly http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getTechnologies(): Observable<Technology[]> {
        const url = this.URL + '/technologies';
        return this.http.get<Technology[]>(url);
    }

    getLocations(): Observable<Location[]> {
        const url = this.URL + '/locations';
        return this.http.get<Location[]>(url);
    }
}

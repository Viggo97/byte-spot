import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Location } from '../models/location.interface';
import { Technology } from '../models/technology.interface';

@Injectable()
export class FiltersDataService {
    private http = inject(HttpClient);

    private readonly URL = 'http://localhost:5000';

    getTechnologies(): Observable<Technology[]> {
        return of([
            {
                id: '1',
                name: 'c#',
                icon: 'ic1',
            },
            {
                id: '2',
                name: 'C++',
                icon: 'ic2',
            },
            {
                id: '3',
                name: 'java',
                icon: 'ic3',
            },
        ]);
    }

    getLocations(): Observable<Location[]> {
        return of([
            {
                id: '1',
                name: 'Warszawa',
            },
            {
                id: '2',
                name: 'Kraków',
            },
            {
                id: '3',
                name: 'Wrocław',
            },
        ]);
    }
}

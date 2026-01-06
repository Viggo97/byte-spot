import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { OfferPost } from '../models/offer-post.interface';

@Injectable()
export class ListDataService {
    private http = inject(HttpClient);

    private readonly URL = 'http://localhost:5000';

    getOffers(): Observable<OfferPost[]> {
        return of([
            {
                title: 'Junior JavaScript Developer',
                salary: {
                    min: 6000,
                    max: 8500,
                },
                locations: ['Poznań', 'Warszawa'],
                company: 'Microsoft',
                technologies: ['TypeScript', 'JavaScript'],
            },
            {
                title: 'Python Developer',
                salary: {
                    min: 12000,
                    max: 15000,
                },
                locations: ['Kraków', 'Opole'],
                company: 'Apple',
                technologies: ['Python', 'C++', 'SQL'],
            },
            {
                title: '.Net Developer',
                salary: {
                    min: 13000,
                    max: 16000,
                },
                locations: ['Poznań', 'Rzeszów', 'Sopot', 'Warszawa'],
                company: 'Microsoft',
                technologies: ['C#', '.Net', 'SQL', 'EntityFramework'],
            },
        ]);
    }
}

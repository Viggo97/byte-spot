import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map, Observable, of, shareReplay } from 'rxjs';

import { CoreValue } from '@core';
import { OfferSort } from '@app/features/offers-overview/enums/offer-sort.enum';
import { PaginationParams } from '@app/features/offers-overview/types/pagination-params';
import { OfferPostList } from '@app/features/offers-overview/interfaces/offer-post-list.interface';
import { OfferSearchSuggestionCategory } from '@app/features/offers-overview/offer-search/offer-search-suggestion-category.enum';
import { OfferSearchSuggestions } from './offer-search/offer-search-suggestions.interface';

@Injectable({ providedIn: 'root' })
export class OffersService {
    private mockCities: CoreValue[] = [
        {
            key: 'warsaw',
            value: 'Warszawa',
        },
        {
            key: 'cracow',
            value: 'Krakow',
        },
        {
            key: 'gdansk',
            value: 'Gdansk',
        },
        {
            key: 'wroclaw',
            value: 'Wroclaw',
        },
        {
            key: 'poznan',
            value: 'Poznan',
        },
    ];
    private mockTechnologies: CoreValue[] = [
        {
            key: 'aws',
            value: 'AWS',
        },
        {
            key: 'azure',
            value: 'Azure',
        },
        {
            key: 'c',
            value: 'C',
        },
        {
            key: 'cpp',
            value: 'C++',
        },
        {
            key: 'csharp',
            value: 'C#',
        },
        {
            key: 'go',
            value: 'Go',
        },
        {
            key: 'java',
            value: 'Java',
        },
        {
            key: 'javascript',
            value: 'JavaScript',
        },
        {
            key: 'mobile',
            value: 'Mobile',
        },
        {
            key: 'php',
            value: 'PHP',
        },
        {
            key: 'python',
            value: 'Python',
        },
        {
            key: 'ruby',
            value: 'Ruby',
        },
        {
            key: 'rust',
            value: 'Rust',
        },
        {
            key: 'sql',
            value: 'SQL',
        },
        {
            key: 'typescript',
            value: 'TypeScript',
        },
    ];

    getCities(): Observable<CoreValue[]> {
        return of(this.mockCities).pipe(delay(3000));
    }

    getTechnologies(): Observable<CoreValue[]> {
        return of(this.mockTechnologies).pipe(delay(3000));
    }

    private http = inject(HttpClient);

    private URL = 'http://localhost:8080';

    getLocations(): Observable<CoreValue[]> {
        const url = `${this.URL}/locations`;
        return this.http.get<CoreValue[]>(url)
            .pipe(shareReplay(1));
    }

    getTechs(): Observable<CoreValue[]> {
        const url = `${this.URL}/technologies`;
        return this.http.get<CoreValue[]>(url)
            .pipe(shareReplay(1));
    }

    getOffers(sort: OfferSort, pagination: PaginationParams, searchTerm: string): Observable<OfferPostList> {
        const url = `${this.URL}/offers`;
        const params = new HttpParams()
            .set('sort', sort)
            .set('page', pagination.page)
            .set('limit', pagination.limit)
            .set('search', searchTerm);

        return this.http.get<OfferPostList>(url, { params });
    }

    getSearchSuggestions(searchTerm: string): Observable<OfferSearchSuggestions[]> {
        const url = `${this.URL}/offers/suggestions`;
        const params = new HttpParams()
            .set('search', searchTerm);
        return this.http.get<OfferSearchSuggestions[]>(url, { params })
            .pipe(
                map((suggestions) => {
                    const notEmptySuggestions = suggestions.filter((suggestion) => suggestion.results.length > 0);
                    return notEmptySuggestions.length > 0
                        ? notEmptySuggestions
                        : [{ category: OfferSearchSuggestionCategory.KEYWORD, results: [searchTerm] }];
                }),
            );
    }
}

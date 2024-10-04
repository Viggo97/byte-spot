import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, shareReplay } from 'rxjs';

import { CoreValue } from '@core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OfferSort } from '@app/features/offers-overview/enums/offer-sort.enum';
import { PaginationParams } from '@app/features/offers-overview/types/pagination-params';
import { OfferPostList } from '@app/features/offers-overview/interfaces/offer-post-list.interface';
import { OfferSearchSuggestionsGroup } from './offer-search/offer-search-suggestions/model/offer-search-suggestion-group.model';
import { OfferSearchSuggestionCategory } from './offer-search/offer-search-suggestions/model/offer-search-suggestion-category.enum';

@Injectable({ providedIn: 'root' })
export class OffersService {
    private mockSuggestions: OfferSearchSuggestionsGroup[] = [
        {
            category: OfferSearchSuggestionCategory.COMPANY,
            suggestions: [
                'Apple',
                'Google',
                'Microsoft',
                'Oracle',
            ],
        },
        {
            category: OfferSearchSuggestionCategory.LOCATION,
            suggestions: [
                'Warsaw',
                'Cracow',
                'London',
            ],
        },
        {
            category: OfferSearchSuggestionCategory.SKILL,
            suggestions: [
                'Angular',
                'React',
                'Vue',
                'Java',
                'JavaScript',
                'TypeScript',
                'C',
                'C++',
                'C#',
                'Rust',
            ],
        },
        {
            category: OfferSearchSuggestionCategory.POSITION,
            suggestions: [
                'Java Backend Developer',
                '.NET Backend Developer',
                'Angular Frontend Developer',
            ],
        },
    ];
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

    getSearchSuggestions(searchTerm: string | null): Observable<OfferSearchSuggestionsGroup[]> {
        if (!searchTerm) {
            return of(this.mockSuggestions);
        }
        const suggestions: OfferSearchSuggestionsGroup[] = [];

        this.mockSuggestions.forEach((group) => {
            const filteredSuggestions = group.suggestions
                .filter((suggestion) => suggestion.toLowerCase().includes(searchTerm.toLowerCase()));
            if (filteredSuggestions.length > 0) {
                suggestions.push({
                    category: group.category,
                    suggestions: filteredSuggestions,
                });
            }
        });

        if (!suggestions.length) {
            suggestions.push({
                category: OfferSearchSuggestionCategory.KEYWORD,
                suggestions: [searchTerm],
            });
        }

        return of(suggestions).pipe(delay(100));
    }

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

    getOffers(sort: OfferSort, pagination: PaginationParams): Observable<OfferPostList> {
        const url = `${this.URL}/offers`;
        const params = new HttpParams()
            .set('sort', sort)
            .set('page', pagination.page)
            .set('limit', pagination.limit);

        return this.http.get<OfferPostList>(url, { params });
    }

    // getSearchSuggestions(): Observable<any> {
    //     const url = `${this.URL}/search`;
    //     return this.http.get(url);
    // }
}

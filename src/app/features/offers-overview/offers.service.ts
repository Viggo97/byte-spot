import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';

import { OfferSort } from './enums/offer-sort.enum';
import { PaginationParams } from './types/pagination-params';
import { OfferFilters } from './offer-filters/offer-filters.model';
import { OfferPostList } from './interfaces/offer-post-list.interface';
import { OfferSearchSuggestions } from './offer-search/offer-search-suggestions.interface';
import { OfferSearchSuggestionCategory } from './offer-search/offer-search-suggestion-category.enum';

@Injectable({ providedIn: 'root' })
export class OffersService {
    private http = inject(HttpClient);

    private URL = 'http://localhost:8080';

    getLocations(): Observable<string[]> {
        const url = `${this.URL}/locations`;
        return this.http.get<string[]>(url)
            .pipe(
                shareReplay(1),
            );
    }

    getTechnologies(): Observable<KeyValue<string, string>[]> {
        const url = `${this.URL}/technologies`;
        return this.http.get<KeyValue<string, string>[]>(url)
            .pipe(shareReplay(1));
    }

    getOffers(
        sort: OfferSort,
        pagination: PaginationParams,
        searchTerm: string,
        filters: OfferFilters | null,
    ): Observable<OfferPostList> {
        const url = `${this.URL}/offers`;
        let params = new HttpParams()
            .set('sort', sort)
            .set('page', pagination.page)
            .set('limit', pagination.limit);
        const body = filters;

        if (searchTerm) {
            params = params.append('search', searchTerm);
        }

        return this.http.post<OfferPostList>(url, body, { params });
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

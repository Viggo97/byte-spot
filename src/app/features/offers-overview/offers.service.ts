import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import {
    OfferSearchSuggestionsGroup,
} from './offer-search/offer-search-suggestions/model/offer-search-suggestion-group.model';
import {
    OfferSearchSuggestionCategory,
} from './offer-search/offer-search-suggestions/model/offer-search-suggestion-category.enum';

@Injectable({
    providedIn: 'root',
})
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

    getSearchSuggestions(searchTerm: string | null): Observable<OfferSearchSuggestionsGroup[]> {
        // return of(this.mockSuggestions);

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
}

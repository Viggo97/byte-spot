import { Injectable } from '@angular/core';
import { SuggestionCategories } from '@app/features/offers-overview/model/suggestion-categories.enum';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import {
    delay, Observable, of,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OffersService {
    private mockSuggestions: SuggestionsGroup[] = [
        {
            category: SuggestionCategories.COMPANY,
            suggestions: [
                'Apple',
                'Google',
                'Microsoft',
                'Oracle',
            ],
        },
        {
            category: SuggestionCategories.LOCATION,
            suggestions: [
                'Warsaw',
                'Cracow',
                'London',
            ],
        },
        {
            category: SuggestionCategories.SKILL,
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
            category: SuggestionCategories.POSITION,
            suggestions: [
                'Java Backend Developer',
                '.NET Backend Developer',
                'Angular Frontend Developer',
            ],
        },
    ];

    getSearchSuggestions(searchTerm: string | null): Observable<SuggestionsGroup[]> {
        if (!searchTerm) {
            return of(this.mockSuggestions);
        }
        const suggestions: SuggestionsGroup[] = [];

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
                category: SuggestionCategories.KEYWORD,
                suggestions: [searchTerm],
            });
        }

        return of(suggestions).pipe(delay(500));
    }
}

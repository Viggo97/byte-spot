import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { OfferSearchSuggestionsGroup } from './offer-search/offer-search-suggestions/model/offer-search-suggestion-group.model';
import { OfferSearchSuggestionCategory } from './offer-search/offer-search-suggestions/model/offer-search-suggestion-category.enum';
import { Location } from './interfaces/location.interface';
import { Technology } from './interfaces/technology.interface';

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
    private mockCities: Location[] = [
        {
            id: 'warsaw',
            name: 'Warszawa',
        },
        {
            id: 'cracow',
            name: 'Krakow',
        },
        {
            id: 'gdansk',
            name: 'Gdansk',
        },
        {
            id: 'wroclaw',
            name: 'Wroclaw',
        },
        {
            id: 'poznan',
            name: 'Poznan',
        },
    ];
    private mockTechnologies: Technology[] = [
        {
            id: 'aws',
            name: 'AWS',
        },
        {
            id: 'azure',
            name: 'Azure',
        },
        {
            id: 'c',
            name: 'C',
        },
        {
            id: 'cpp',
            name: 'C++',
        },
        {
            id: 'csharp',
            name: 'C#',
        },
        {
            id: 'go',
            name: 'Go',
        },
        {
            id: 'java',
            name: 'Java',
        },
        {
            id: 'javascript',
            name: 'JavaScript',
        },
        {
            id: 'mobile',
            name: 'Mobile',
        },
        {
            id: 'php',
            name: 'PHP',
        },
        {
            id: 'python',
            name: 'Python',
        },
        {
            id: 'ruby',
            name: 'Ruby',
        },
        {
            id: 'rust',
            name: 'Rust',
        },
        {
            id: 'sql',
            name: 'SQL',
        },
        {
            id: 'typescript',
            name: 'TypeScript',
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

    getCities(): Observable<Location[]> {
        return of(this.mockCities).pipe(delay(100));
    }

    getTechnologies(): Observable<Technology[]> {
        return of(this.mockTechnologies).pipe(delay(100));
    }
}

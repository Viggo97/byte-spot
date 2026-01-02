import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SearchOption } from '../models/search-option.interface';

@Injectable()
export class SearchDataService {
    private http = inject(HttpClient);

    private readonly URL = 'http://localhost:5000';

    getSearchOptions(searchTerm: string): Observable<SearchOption[]> {
        const data = [
            {
                value: 'Apple',
                category: 'company',
            },
            {
                value: 'Microsoft',
                category: 'company',
            },
            {
                value: 'Oracle',
                category: 'company',
            },
            {
                value: 'IBM',
                category: 'company',
            },
            {
                value: 'Warsaw',
                category: 'location',
            },
            {
                value: 'Cracow',
                category: 'location',
            },
            {
                value: 'C#',
                category: 'technology',
            },
            {
                value: 'Java',
                category: 'technology',
            },
            {
                value: 'Python',
                category: 'technology',
            },
        ];
        return of(data.filter(v => v.value.toLowerCase().includes(searchTerm.toLowerCase())));
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { Suggestion } from 'projects/byte-spot/src/app/features/offers/overview/search/models/suggestion.interface';

@Injectable()
export class SearchDataService {
    private http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getSearchOptions(searchPhrase: string): Observable<Suggestion[]> {
        const url = this.URL + '/offers/suggestions';
        const params = new HttpParams().set('searchPhrase', searchPhrase);
        return this.http.get<Suggestion[]>(url, { params });
    }
}

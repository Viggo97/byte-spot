import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { OfferPostList } from '../models/offer-post-list.interface';

@Injectable()
export class ListDataService {
    private http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getOffers(params: HttpParams): Observable<OfferPostList> {
        const url = this.URL + '/offers';
        return this.http.get<OfferPostList>(url, { params });
    }
}

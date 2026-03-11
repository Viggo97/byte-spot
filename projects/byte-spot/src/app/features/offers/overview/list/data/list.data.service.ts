import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { PagedResults } from '@app/shared/models/paged-results.interface';
import { OfferPost } from '../models/offer-post.interface';

@Injectable()
export class ListDataService {
    private http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getOffers(params: HttpParams): Observable<PagedResults<OfferPost>> {
        const url = this.URL + '/offers';
        return this.http.get<PagedResults<OfferPost>>(url, { params });
    }
}

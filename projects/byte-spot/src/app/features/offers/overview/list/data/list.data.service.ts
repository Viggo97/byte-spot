import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { HttpParamsConverter, PagedResults } from '@shared';
import { Offer } from 'projects/byte-spot/src/app/features/offers/overview/list/models/offer.interface';
import { OffersListParams } from '../models/offers-list-params.interface';

@Injectable()
export class ListDataService {
    private http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getOffersList(offersListParams?: OffersListParams): Observable<PagedResults<Offer>> {
        const url = this.URL + '/offers';
        const params = this.createOfferListHttpParams(offersListParams);
        return this.http.get<PagedResults<Offer>>(url, { params });
    }

    createOfferListHttpParams(offerListParams?: OffersListParams): HttpParams {
        const params: OffersListParams = {
            ...offerListParams,
            pageSize: offerListParams?.pageSize ?? 10,
            pageNumber: offerListParams?.pageNumber ?? 1,
        };

        return HttpParamsConverter({ ...params });
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { OfferDetails } from './models/offer-details.interface';

@Injectable()
export class OfferDetailsDataService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getOfferDetails(id: string): Observable<OfferDetails> {
        const url = this.URL + '/offers/' + id;
        return this._http.get<OfferDetails>(url);
    }
}

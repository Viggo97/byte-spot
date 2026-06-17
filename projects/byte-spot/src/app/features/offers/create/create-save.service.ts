import { inject, Injectable } from '@angular/core';
import { CreateOfferDto } from '@app/features/offers/create/create-offer-dto.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';

@Injectable() export class OfferCreateSaveService {
    private readonly _http = inject(HttpClient);

    private readonly _url = environment.apiUrl + '/offers';

    save(offerCreateDto: CreateOfferDto): Observable<object> {
        return this._http.post<object>(this._url, offerCreateDto);
    }
}

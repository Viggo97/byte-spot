import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { OfferApplicationDto } from './offers/models/offer-application-dto.interface';
import { OfferApplication } from './offers/models/offer-application.interface';
import { ApplicationDto } from './applications/models/application-dto.interface';
import { Application } from './applications/models/application.interface';
import { OfferMinimal } from './applications/models/offer-minimal.interface';
import { OfferMinimalDto } from './applications/models/offer-minimal-dto.interface';

@Injectable()
export class EmployerDataService {
    private readonly _http = inject(HttpClient);
    private readonly _url = environment.apiUrl;

    getOffers(companyId: string): Observable<OfferApplication[]> {
        const url = this._url + '/offers/company/' + companyId;
        return this._http.get<OfferApplicationDto[]>(url)
            .pipe(
                map((applications) => {
                    return applications.map(app => ({
                        id: app.id,
                        title: app.title,
                        expires: new Date(app.expires).toLocaleDateString(),
                    }));
                }),
            );
    }

    getApplications(offerId: string): Observable<Application[]> {
        const url = this._url + '/applications/offer/' + offerId;
        return this._http.get<ApplicationDto[]>(url);
    }

    getOffer(id: string): Observable<OfferMinimal> {
        const url = this._url + '/offers/minimal/' + id;
        return this._http.get<OfferMinimalDto>(url);
    }
}

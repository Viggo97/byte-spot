import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { SendApplicationDto } from './apply/send-application-dto.interface';

@Service()
export class ApplicationDataService {
    private readonly _http = inject(HttpClient);
    private readonly _url = environment.apiUrl + '/applications';

    sendApplication(applicationDto: SendApplicationDto): Observable<object> {
        const formData = new FormData();
        formData.append('offerId', applicationDto.offerId);
        formData.append('candidateFirstName', applicationDto.candidateFirstName);
        formData.append('candidateLastName', applicationDto.candidateLastName);
        formData.append('candidateEmail', applicationDto.candidateEmail);
        formData.append('resume', applicationDto.resume);

        return this._http.post<object>(this._url, formData);
    }
}

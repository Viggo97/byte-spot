import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListDataService } from './data/list.data.service';
import { OfferPost } from './models/offer-post.interface';

@Injectable()
export class ListService {
    private listDataService = inject(ListDataService);

    getOffers(): Observable<OfferPost[]> {
        return this.listDataService.getOffers();
    }
}

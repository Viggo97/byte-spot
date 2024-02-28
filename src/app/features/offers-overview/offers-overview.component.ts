import { Component } from '@angular/core';
import { OffersComponent } from '@app/features/components/offers/offers.component';

@Component({
    selector: 'bsa-offers-overview',
    standalone: true,
    imports: [
        OffersComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
})
export class OffersOverviewComponent {

}

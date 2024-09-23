import { Component, Input } from '@angular/core';

import { IconComponent, NumberFormatterPipe, SkeletonComponent } from '@shared';
import { TranslatePipe } from '@core';
import { OfferPost } from '../../interfaces/offer-post.interface';

@Component({
    selector: 'bsa-offer-list-item',
    standalone: true,
    imports: [
        IconComponent,
        NumberFormatterPipe,
        SkeletonComponent,
        TranslatePipe,
    ],
    templateUrl: './offer-list-item.component.html',
    styleUrl: './offer-list-item.component.scss',
})
export class OfferListItemComponent {
    @Input() offer?: OfferPost = undefined;

    ngOnInit() {
        setTimeout(() => {
            this.offer = {
                title: 'Senior Java Script Developer (Node.js + REST + Docker)',
                salary: {
                    min: 12000,
                    max: 18000,
                    currency: 'PLN',
                },
                location: ['Cracow', 'Warsaw'],
                company: 'Microsoft',
                workMode: 'Hybrid',
                employmentType: 'Employment contract',
                seniority: 'Senior',
                technologies: ['JavaScript', 'Typescript', 'Node.js', 'Docker', 'REST'],
                newOffer: true,
            };
        }, 2000);
    }
}

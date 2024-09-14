import { Component, Input } from '@angular/core';

import { IconComponent, NumberFormatterPipe } from '@shared';
import { OfferPost } from '../../interfaces/offer-post.interface';

@Component({
    selector: 'bsa-offer-list-item',
    standalone: true,
    imports: [
        IconComponent,
        NumberFormatterPipe,
    ],
    templateUrl: './offer-list-item.component.html',
    styleUrl: './offer-list-item.component.scss',
})
export class OfferListItemComponent {
    @Input() offer: OfferPost = {
        title: 'Senior Java Script Developer (Node.js + REST + Docker)',
        salary: {
            min: 12000,
            max: 18000,
            currency: 'PLN',
        },
        location: 'Cracow',
        company: 'Microsoft',
        workMode: 'Hybrid',
        employmentType: 'Employment contract',
        seniority: 'Senior',
        technologies: ['JavaScript', 'Typescript', 'Node.js', 'Docker', 'REST'],
    };
}

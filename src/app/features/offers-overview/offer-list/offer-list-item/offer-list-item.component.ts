import { Component, Input } from '@angular/core';

import { IconComponent, NumberFormatterPipe } from '@shared';
import { SkeletonComponent } from '@app/shared/components/skeleton/skeleton.component';
import { OfferPost } from '../../interfaces/offer-post.interface';

@Component({
    selector: 'bsa-offer-list-item',
    standalone: true,
    imports: [
        IconComponent,
        NumberFormatterPipe,
        SkeletonComponent,
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
                location: 'Cracow',
                company: 'Microsoft',
                workMode: 'Hybrid',
                employmentType: 'Employment contract',
                seniority: 'Senior',
                technologies: ['JavaScript', 'Typescript', 'Node.js', 'Docker', 'REST'],
            };
        }, 2000);
    }
}

import { Component } from '@angular/core';
import { OfferComponent } from '@app/features/offers-overview/components/offer/offer.component';
import { Offer } from '@app/features/offers-overview/model/offer.model';

@Component({
    selector: 'bsa-offers',
    standalone: true,
    imports: [
        OfferComponent,
    ],
    templateUrl: './offers.component.html',
    styleUrl: './offers.component.scss',
})
export class OffersComponent {
    offers: Offer[] = [
        {
            id: 'o1',
            title: 'Senior Java Developer',
            companyId: 'c1',
            companyName: 'Oracle',
            location: 'San Francisco',
            minSalary: 17000,
            maxSalary: 22000,
            technologyLabels: ['Java', 'Spring', 'Hibernate'],
        },
        {
            id: 'o2',
            title: 'Mid .Net Developer',
            companyId: 'c2',
            companyName: 'Microsoft',
            location: 'Los Angeles',
            minSalary: 11000,
            maxSalary: 16000,
            technologyLabels: ['C#', '.Net', 'Entity Framework'],
        },
        {
            id: 'o3',
            title: 'Junior JavaScript Developer',
            companyId: 'c3',
            companyName: 'Google',
            location: 'New York',
            minSalary: 6000,
            maxSalary: 9000,
            technologyLabels: ['JavaScript', 'Angular', 'TypeScript', 'HTML', 'Node.js'],
        },
    ];
}

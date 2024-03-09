import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferComponent } from './offer.component';

describe('OfferComponent', () => {
    let component: OfferComponent;
    let fixture: ComponentFixture<OfferComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OfferComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(OfferComponent);
        component = fixture.componentInstance;
        component.offer = {
            id: 'o1',
            title: 'Senior Java Developer but now the title is much more longer than somebody can suppose',
            companyId: 'c1',
            companyName: 'Oracle',
            location: 'San Francisco',
            minSalary: 17000,
            maxSalary: 22000,
            technologyLabels: ['Java', 'Spring', 'Hibernate'],
        };
        fixture.detectChanges();
    });

    it('should create component with input', () => {
        expect(component).toBeTruthy();
    });
});

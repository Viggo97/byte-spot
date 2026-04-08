import { Salary } from '@app/features/offers/shared/models/salary.interface';

export interface Offer {
    id: string;
    title: string;
    company: string;
    salaries: Salary[];
    locations: string[];
    technologies: string[];
}

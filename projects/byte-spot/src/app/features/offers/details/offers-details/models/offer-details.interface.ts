import { LookupItem } from '@shared';
import { Salary } from '@app/features/offers/shared/models/salary.interface';

export interface OfferDetails {
    title: string;
    company: LookupItem;
    validFrom: number;
    validTo: number;
    salaries: Salary[];
    locations: string[];
    technologies: string[],
    workModes: string[];
    experienceLevels: string[];
    description: string;
}

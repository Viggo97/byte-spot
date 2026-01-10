import { ValueOf } from '@shared';

export class FiltersDto {
    salaryMin?: number;
    salaryMax?: number;
    workMode?: ValueOf<typeof FiltersDto.workModeValueMap>[];
    employmentType?: ValueOf<typeof FiltersDto.employmentTypeValueMap>[];
    seniority?: ValueOf<typeof FiltersDto.seniorityValueMap>[];
    technologies?: string[];
    locations?: string[];

    static readonly workModeValueMap = {
        onSite: 'onsite',
        hybrid: 'hybrid',
        remote: 'remote',
    } as const;

    static readonly employmentTypeValueMap = {
        employmentContract: 'employmentContract',
        b2b: 'b2b',
        mandateContract: 'mandateContract',
        specificTaskContract: 'specificTaskContract',
    } as const;

    static readonly seniorityValueMap = {
        intern: 'intern',
        junior: 'junior',
        mid: 'mid',
        senior: 'senior',
        expert: 'expert',
    } as const;
}

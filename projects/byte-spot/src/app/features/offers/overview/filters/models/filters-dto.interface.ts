import { ValueOf } from '@shared';

export class FiltersDto {
    salaryFrom?: number;
    salaryTo?: number;
    workMode?: ValueOf<typeof FiltersDto.workModeValueMap>[];
    employmentType?: ValueOf<typeof FiltersDto.employmentTypeValueMap>[];
    seniority?: ValueOf<typeof FiltersDto.seniorityValueMap>[];
    technologies?: string[];
    locations?: string[];

    static readonly workModeValueMap = {
        onSite: 'on-site',
        hybrid: 'hybrid',
        remote: 'remote',
    } as const;

    static readonly employmentTypeValueMap = {
        employmentContract: '1',
        b2b: '2',
        mandateContract: '3',
        specificTaskContract: '4',
        internship: '5',
    } as const;

    static readonly seniorityValueMap = {
        intern: '1',
        junior: '2',
        mid: '3',
        senior: '4',
        expert: '5',
    } as const;
}

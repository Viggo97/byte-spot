import { Range } from '@byte-spot-lib';

export class Filters {
    salary: Range;
    technologies: boolean[];
    locations: boolean[];
    workModes: boolean[];
    experienceLevels: boolean[];
    employmentTypes: boolean[];

    constructor(
        salary: Range,
        technologies: boolean[],
        locations: boolean[],
        workModes: boolean[],
        experienceLevels: boolean[],
        employmentTypes: boolean[],
    ) {
        this.salary = salary;
        this.technologies = technologies;
        this.locations = locations;
        this.workModes = workModes;
        this.experienceLevels = experienceLevels;
        this.employmentTypes = employmentTypes;
    }

    static SalaryFrom = 0;
    static SalaryTo = 50_000;

    static default(): Filters {
        return new Filters(new Range(Filters.SalaryFrom, Filters.SalaryTo), [], [], [], [], []);
    }
}

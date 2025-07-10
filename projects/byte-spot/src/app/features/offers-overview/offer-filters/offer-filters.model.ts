export class OfferFilters {
    salary: {
        min: number,
        max: number,
    };
    technologies: string[];
    workMode: string[];
    employmentType: string[];
    locations: string[];
    seniority: string[];

    constructor(
        min: number,
        max: number,
        technologies: string[],
        workMode: string[],
        employmentType: string[],
        locations: string[],
        seniority: string[],
    ) {
        this.salary = {
            min,
            max,
        };
        this.technologies = technologies;
        this.workMode = workMode;
        this.employmentType = employmentType;
        this.locations = locations;
        this.seniority = seniority;
    }
}

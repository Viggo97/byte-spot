export class DynamicFilters {
    technologies: boolean[];
    locations: boolean[];
    workModes: boolean[];
    experienceLevels: boolean[];
    employmentTypes: boolean[];

    constructor(
        technologies: boolean[],
        locations: boolean[],
        workModes: boolean[],
        experienceLevels: boolean[],
        employmentTypes: boolean[],
    ) {
        this.technologies = technologies;
        this.locations = locations;
        this.workModes = workModes;
        this.experienceLevels = experienceLevels;
        this.employmentTypes = employmentTypes;
    }

    static default(): DynamicFilters {
        return new DynamicFilters([], [], [], [], []);
    }
}

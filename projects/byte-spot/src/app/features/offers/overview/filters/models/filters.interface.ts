import { Salary } from './salary.interface';

export interface Filters {
    salary: Salary;
    technologies: boolean[];
    locations: boolean[];
    workModes: boolean[];
    experienceLevels: boolean[];
    employmentTypes: boolean[];
}

import { Salary } from './salary.interface';
import { WorkMode } from './work-mode.interface';
import { EmploymentType } from './employment-type.interface';
import { Seniority } from './seniority.interface';

export interface Filters {
    salary: Salary;
    workMode: WorkMode;
    employmentType: EmploymentType;
    seniority: Seniority;
    technologies: boolean[];
    locations: boolean[];
}

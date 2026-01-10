import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Exact } from '@shared';
import { Technology } from '../models/technology.interface';
import { Location } from '../models/location.interface';
import { Salary } from '../models/salary.interface';
import { WorkMode } from '../models/work-mode.interface';
import { EmploymentType } from '../models/employment-type.interface';
import { Seniority } from '../models/seniority.interface';
import { Filters } from '../models/filters.interface';

@Injectable()
export class FiltersFormService {
    private formBuilder = inject(FormBuilder);

    form = this.formBuilder.nonNullable.group({
        salary: this.formBuilder.nonNullable.control<Salary>({ from: 0, to: 50_000 }),
        workMode: this.formBuilder.nonNullable.group<WorkMode>({
            onSite: false,
            hybrid: false,
            remote: false,
        }),
        employmentType: this.formBuilder.nonNullable.group<EmploymentType>({
            employmentContract: false,
            b2b: false,
            mandateContract: false,
            specificTaskContract: false,
            internship: false,
        }),
        seniority: this.formBuilder.nonNullable.group<Seniority>({
            intern: false,
            junior: false,
            mid: false,
            senior: false,
            expert: false,
        }),
        technologies: this.formBuilder.nonNullable.array<boolean>([]),
        locations: this.formBuilder.nonNullable.array<boolean>([]),
    });

    initTechnologiesForm(technologies: Technology[]): void {
        technologies.forEach(() => {
            this.form.controls.technologies.push(this.formBuilder.nonNullable.control(false), {emitEvent: false});
        });
    }

    initLocationsForm(locations: Location[]): void {
        locations.forEach(() => {
            this.form.controls.locations.push(this.formBuilder.nonNullable.control(false), {emitEvent: false});
        });
    }

    getFormValue(): Filters {
        return this.form.getRawValue() satisfies Exact<ReturnType<typeof this.form.getRawValue>, Filters>;
    }
}

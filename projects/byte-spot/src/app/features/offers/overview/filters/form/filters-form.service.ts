import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Exact } from '@shared';
import { Salary } from '../models/salary.interface';
import { Filters } from '../models/filters.interface';
import { LookupItem } from '@app/shared/models/lookup-item.interface';

@Injectable()
export class FiltersFormService {
    private _formBuilder = inject(FormBuilder);

    form = this._formBuilder.nonNullable.group({
        salary: this._formBuilder.nonNullable.control<Salary>({ from: 0, to: 50_000 }),
        technologies: this._formBuilder.nonNullable.array<boolean>([]),
        locations: this._formBuilder.nonNullable.array<boolean>([]),
        workModes: this._formBuilder.nonNullable.array<boolean>([]),
        experienceLevels: this._formBuilder.nonNullable.array<boolean>([]),
        employmentTypes: this._formBuilder.nonNullable.array<boolean>([]),
    });

    initLookupFiltersForm(items: LookupItem[], formGroupName: string): void {
        if (formGroupName in this.form.controls) {
            const formGroup = this.form.controls[formGroupName as keyof typeof this.form.controls];
            if (formGroup instanceof FormArray) {
                items.forEach(() => {
                    formGroup.push(this._formBuilder.nonNullable.control(false), {emitEvent: false});
                });
            }
        }
    }

    getFormValue(): Filters {
        return this.form.getRawValue() satisfies Exact<ReturnType<typeof this.form.getRawValue>, Filters>;
    }
}

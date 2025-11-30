import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { catchError, forkJoin, of, Subject } from 'rxjs';
import { booleanStringValueMapper , HttpParamConverter } from '@shared';
import { Technology } from './models/technology.interface';
import { Location } from './models/location.interface';
import { FiltersDataService } from './data/filters-data.service';
import { FiltersFormService } from './form/filters-form.service';
import { FiltersDto } from './models/filters-dto.interface';

@Injectable()
export class FiltersService {
    private filtersDataService = inject(FiltersDataService);
    private filtersFormService = inject(FiltersFormService);

    technologies: Technology[] = [];
    locations: Location[] = [];

    private filtersChanged = new Subject<void>();
    filtersChanged$ = this.filtersChanged.asObservable();

    constructor() {
        this.fetchDynamicData();
    }

    fetchDynamicData(): void {
        forkJoin([
            this.filtersDataService.getTechnologies(),
            this.filtersDataService.getLocations(),
        ])
            .pipe(
                catchError(() => of([[], []])),
            )
            .subscribe(([technologies, locations]) => {
                this.technologies = technologies;
                this.locations = locations;
                this.filtersFormService.initTechnologiesForm(this.technologies);
                this.filtersFormService.initLocationsForm(this.locations);
            });
    }

    createFilterDto(): FiltersDto {
        const form = this.filtersFormService.getFormValue();
        return {
            salaryFrom: form.salary.from,
            salaryTo: form.salary.to,
            workMode: booleanStringValueMapper(FiltersDto.workModeValueMap, form.workMode),
            employmentType: booleanStringValueMapper(FiltersDto.employmentTypeValueMap, form.employmentType),
            seniority: booleanStringValueMapper(FiltersDto.seniorityValueMap, form.seniority),
            technologies: this.getSelectedTechnologies(),
            locations: this.getSelectedLocations(),
        };
    }

    createFilterParams(): HttpParams {
        const form = this.filtersFormService.getFormValue();
        const defaultSalaryFrom = this.filtersFormService.form.controls.salary.defaultValue.from;
        const defaultSalaryTo = this.filtersFormService.form.controls.salary.defaultValue.to;
        return HttpParamConverter({
            salaryFrom: form.salary.from !== defaultSalaryFrom && form.salary.from,
            salaryTo: form.salary.to !== defaultSalaryTo && form.salary.to,
            workMode: booleanStringValueMapper(FiltersDto.workModeValueMap, form.workMode),
            employmentType: booleanStringValueMapper(FiltersDto.employmentTypeValueMap, form.employmentType),
            seniority: booleanStringValueMapper(FiltersDto.seniorityValueMap, form.seniority),
            technologies: this.getSelectedTechnologies(),
            locations: this.getSelectedLocations(),
        });
    }

    private getSelectedTechnologies(): string[] {
        return this.technologies
            .filter((_value, index) => this.filtersFormService.form.controls.technologies.at(index).getRawValue())
            .map(value => value.id);
    }

    private getSelectedLocations(): string[] {
        return this.locations
            .filter((_value, index) => this.filtersFormService.form.controls.locations.at(index).getRawValue())
            .map(value => value.id);
    }

    changeFilters(): void {
        this.filtersChanged.next();
    }
}

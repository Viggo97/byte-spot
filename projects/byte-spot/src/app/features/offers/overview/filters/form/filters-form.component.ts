import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent, RangeComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { FiltersFormService } from './filters-form.service';
import { FiltersService } from '../filters.service';

@Component({
    selector: 'bsa-offers-overview-filters-form',
    imports: [
        ReactiveFormsModule,
        CheckboxComponent,
        RangeComponent,
        TranslatePipe,
    ],
    templateUrl: './filters-form.component.html',
    styleUrl: './filters-form.component.scss',
})
export class FiltersFormComponent {
    protected filterFormService = inject(FiltersFormService);
    protected filtersService = inject(FiltersService);

    protected form = this.filterFormService.form;
    protected technologies = signal([...this.filtersService.technologies]);
    protected locations = signal([...this.filtersService.locations]);
    protected workModes = signal([...this.filtersService.workModes]);
    protected experienceLevels = signal([...this.filtersService.experienceLevels]);
    protected employmentTypes = signal([...this.filtersService.employmentTypes]);
}


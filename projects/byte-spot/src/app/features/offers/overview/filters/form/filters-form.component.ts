import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CheckboxButtonComponent, CheckboxComponent, RangeComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { LookupItem } from '@shared';
import { FiltersFormService } from './filters-form.service';
import { FiltersService } from '../filters.service';
import { Technology } from '../models/technology.interface';

interface SanitizedTechnology extends LookupItem {
    iconCode: SafeHtml;
}

@Component({
    selector: 'bsa-offers-overview-filters-form',
    imports: [
        ReactiveFormsModule,
        CheckboxComponent,
        RangeComponent,
        TranslatePipe,
        CheckboxButtonComponent,
    ],
    templateUrl: './filters-form.component.html',
    styleUrl: './filters-form.component.scss',
})
export class FiltersFormComponent {
    private readonly _sanitizer = inject(DomSanitizer);
    protected _filterFormService = inject(FiltersFormService);
    protected _filtersService = inject(FiltersService);

    protected form = this._filterFormService.form;
    protected technologies = signal<SanitizedTechnology[]>(this.sanitizeSvgIcons(this._filtersService.technologies));
    protected locations = signal([...this._filtersService.locations]);
    protected workModes = signal([...this._filtersService.workModes]);
    protected experienceLevels = signal([...this._filtersService.experienceLevels]);
    protected employmentTypes = signal([...this._filtersService.employmentTypes]);

    private sanitizeSvgIcons(technologies: Technology[]): SanitizedTechnology[] {
        return technologies.map(t => {
            return {
                ...t,
                iconCode: this._sanitizer.bypassSecurityTrustHtml(t.iconCode),
            };
        });
    }
}


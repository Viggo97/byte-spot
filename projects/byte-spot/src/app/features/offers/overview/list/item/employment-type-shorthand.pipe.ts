import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@core';
import { EmploymentType } from '@app/features/offers/shared/enums/employment-type.enum';

@Pipe({name: 'employmentTypeShorthand'})
export class EmploymentTypeShorthandPipe implements PipeTransform {

    private readonly _translateService = inject(TranslateService);

    transform(value: EmploymentType | string): string {
        let shorthand: string;
        if (value === EmploymentType.EmploymentContract)
            shorthand = 'offer.employmentOfContractShort';
        else if (value === EmploymentType.B2B)
            shorthand = 'offer.b2bShort';
        else if (value === EmploymentType.MandateContract)
            shorthand = 'offer.mandateContractShort';
        else if (value === EmploymentType.SpecificTaskContract)
            shorthand = 'offer.specificTaskContractShort';
        else if (value === EmploymentType.Internship)
            shorthand = 'offer.internshipShort';
        else
            shorthand = 'global.na';

        return this._translateService.translate(shorthand);
    }

}

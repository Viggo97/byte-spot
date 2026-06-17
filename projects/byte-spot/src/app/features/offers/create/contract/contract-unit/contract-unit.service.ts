import { inject, Injectable, signal } from '@angular/core';
import { LookupItem } from '@shared';
import { OfferCreateService } from '../../create.service';

interface ContractModel {
    employmentTypes: boolean[];
}

@Injectable()
export class ContractUnitService {
    private readonly _createService = inject(OfferCreateService);

    employmentTypes = signal<LookupItem[]>(this._createService.employmentTypes);
    employmentTypeModel = signal<ContractModel>({
        employmentTypes: new Array<boolean>(this.employmentTypes().length)
            .fill(false),
    });
}

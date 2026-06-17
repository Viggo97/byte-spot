/* eslint-disable @typescript-eslint/unbound-method */

import { disabled, max, min, required, SchemaPathTree, validate } from '@angular/forms/signals';
import { ContractUnit } from './contract-unit.interface';

export function contractUnitValidator(contractsPath: SchemaPathTree<ContractUnit>) {
    disabled(contractsPath.salaryFixed, {when: ({valueOf}) => !valueOf(contractsPath.hasFixedSalary)});
    disabled(contractsPath.salaryMax, {when: ({valueOf}) => valueOf(contractsPath.hasFixedSalary)});
    disabled(contractsPath.salaryMin, {when: ({valueOf}) => valueOf(contractsPath.hasFixedSalary)});

    required(contractsPath.salaryMin, {
        when: ({valueOf}) => !valueOf(contractsPath.hasFixedSalary),
        message: 'offer.salaryMinRequired',
    });
    required(contractsPath.salaryMax, {
        when: ({valueOf}) => !valueOf(contractsPath.hasFixedSalary),
        message: 'offer.salaryMaxRequired',
    });
    required(contractsPath.salaryFixed, {
        when: ({valueOf}) => valueOf(contractsPath.hasFixedSalary),
        message: 'offer.salaryFixedRequired',
    });

    min(contractsPath.salaryMin, 1, {message: 'offer.salaryMinMin'});
    max(contractsPath.salaryMin, 49_999, {message: 'offer.salaryMinMax'});
    min(contractsPath.salaryMax, 2, {message: 'offer.salaryMaxMin'});
    max(contractsPath.salaryMax, 50_000, {message: 'offer.salaryMaxMax'});

    min(contractsPath.salaryFixed, 1, {message: 'offer.salaryFixedMin'});
    max(contractsPath.salaryFixed, 50_000, {message: 'offer.salaryFixedMax'});

    validate(contractsPath.salaryMax,  ({value, valueOf}) => {
        const maxValue = value();
        const minValue = valueOf(contractsPath.salaryMin);

        if (minValue >= maxValue) {
            return {
                kind: 'minMaxValueMismatch',
                message: 'offer.salaryMismatch',
            };
        }
        return null;
    });
}

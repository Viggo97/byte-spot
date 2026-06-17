import { BaseDto } from '@app/features/offers/create/base/base-dto.interface';
import { CompetencesDto } from '@app/features/offers/create/competences/competences-dto.interface';
import { ContractDto } from '@app/features/offers/create/contract/contract-dto.interface';
import { DescriptionDto } from '@app/features/offers/create/description/description-dto.interface';

export class CreateOfferDto {
    title: string;
    workModes: string[];
    locations: string[];
    experienceLevels: string[];
    technologies: string[];
    contracts: ContractDto[];
    description: string;

    constructor(title: string, workModes: string[], locations: string[], experienceLevels: string[],
        technologies: string[], contracts: ContractDto[], description: string) {
        this.title = title;
        this.workModes = workModes;
        this.locations = locations;
        this.experienceLevels = experienceLevels;
        this.technologies = technologies;
        this.contracts = contracts;
        this.description = description;
    }

    static create(base: BaseDto, competences: CompetencesDto, contracts: ContractDto[], description: DescriptionDto)
        : CreateOfferDto {
        return {
            title: base.title,
            workModes: base.workModes,
            locations: base.locations,
            experienceLevels: competences.experienceLevels,
            technologies: competences.technologies,
            contracts: contracts,
            description: description.description,
        };
    }
}

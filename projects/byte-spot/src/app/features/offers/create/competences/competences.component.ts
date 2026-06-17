import { Component, computed, effect, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { CheckboxComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { LookupItem } from '@shared';
import { OfferCreateService } from '../create.service';
import { CompetencesDto } from './competences-dto.interface';

interface CompetenceModel {
    experienceLevels: boolean[];
    technologies: boolean[];
}

@Component({
    selector: 'bsa-offers-create-competences',
    imports: [
        FormField,
        CheckboxComponent,
        TranslatePipe,
    ],
    templateUrl: './competences.component.html',
    styleUrls: [
        '../shared/create-section.scss',
        './competences.component.scss',
    ],
})
export class OffersCreateCompetencesComponent {
    private readonly _createService = inject(OfferCreateService);

    protected experienceLevels = signal<LookupItem[]>(this._createService.experienceLevels);
    protected technologies = signal<LookupItem[]>(this._createService.technologies);

    protected competenceModel = signal<CompetenceModel>({
        experienceLevels: new Array<boolean>(this.experienceLevels().length).fill(false),
        technologies: new Array<boolean>(this.technologies().length).fill(false),
    });

    protected competenceForm = form(
        this.competenceModel,
        (schemaPath) => {
            validate(schemaPath.experienceLevels, ({value}) => {
                const anyExperienceLevelSelected = value().some(v => v);
                if (!anyExperienceLevelSelected) {
                    return {
                        kind: 'atLeastOneExperienceLevelRequired',
                        message: 'offer.atLeastOneExperienceLevelRequired',
                    };
                }
                return null;
            });

            validate(schemaPath.technologies, ({value}) => {
                const anyTechnologySelected = value().some(v => v);
                if (!anyTechnologySelected) {
                    return {
                        kind: 'atLeastOneTechnologyRequired',
                        message: 'offer.atLeastOneTechnologyRequired',
                    };
                }
                return null;
            });

        },
    );

    protected experienceLevelsTouched = signal(false);
    protected technologiesTouched = signal(false);

    formInvalid = computed(() => this.competenceForm().invalid());

    constructor() {
        effect(() => {
            const experienceLevels = this.competenceForm.experienceLevels().value();
            const anyExperienceLevelChecked = experienceLevels.some(v => v);
            if (anyExperienceLevelChecked) {
                this.experienceLevelsTouched.set(true);
            }
        });

        effect(() => {
            const technologies = this.competenceForm.technologies().value();
            const anyTechnologyChecked = technologies.some(v => v);
            if (anyTechnologyChecked) {
                this.technologiesTouched.set(true);
            }
        });
    }

    getDto(): CompetencesDto {
        const experienceLevelItems = this.experienceLevels();
        const technologyItems = this.technologies();
        const experienceLevelsState = this.competenceForm.experienceLevels().value();
        const technologiesState = this.competenceForm.technologies().value();

        const experienceLevelIds = experienceLevelItems
            .map((expLevel) => expLevel.id).filter((_, i) => experienceLevelsState.at(i));
        const technologyIds = technologyItems
            .map((technology) => technology.id).filter((_, i) => technologiesState.at(i));

        return {
            experienceLevels: experienceLevelIds,
            technologies: technologyIds,
        };
    }
}

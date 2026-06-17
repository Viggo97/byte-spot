import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { DescriptionDto } from './description-dto.interface';

interface DescriptionModel {
    description: string;
}

@Component({
    selector: 'bsa-offer-create-description',
    imports: [
        TranslatePipe,
        FormField,
    ],
    templateUrl: './description.component.html',
    styleUrls: [
        '../shared/create-section.scss',
        './description.component.scss',
    ],
})
export class OfferCreateDescriptionComponent {
    protected descriptionModel = signal<DescriptionModel>({description: ''});
    protected descriptionForm = form(
        this.descriptionModel,
        (schemaPath) => {
            required(schemaPath.description, {message: 'offer.descriptionRequired'});
            minLength(schemaPath.description, 32, {message: 'offer.descriptionMinLength'});
            maxLength(schemaPath.description, 1200, {message: 'offer.descriptionMaxLength'});
        },
    );
    formInvalid = computed(() => this.descriptionForm().invalid());

    getDto(): DescriptionDto {
        return this.descriptionModel();
    }
}

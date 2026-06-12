import { Component, computed, inject, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { AuthService, TranslatePipe } from '@core';
import { UserDataDto } from '@app/core/auth/user/user-data-dto.interface';

@Component({
    selector: 'bsa-candidate-profile',
    imports: [
        FormRoot,
        FormField,
        TranslatePipe,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent {
    private readonly _authService = inject(AuthService);
    private readonly _userData = toSignal(this._authService.user$);

    protected userProfileModel = signal({
        firstName: this._userData()?.firstName || '',
        lastName: this._userData()?.lastName || '',
        email: this._userData()?.email || '',
    });

    protected userProfileForm = form(
        this.userProfileModel,
        (schemaPath) => {
            disabled(schemaPath.email);

            required(schemaPath.firstName, {message: 'user.firstNameRequired'});
            minLength(schemaPath.firstName, 2, {message: 'user.firstNameMinLength'});
            maxLength(schemaPath.firstName, 32, {message: 'user.firstNameMaxLength'});

            required(schemaPath.lastName, {message: 'user.lastNameRequired'});
            minLength(schemaPath.lastName, 3, {message: 'user.lastNameMinLength'});
            maxLength(schemaPath.lastName, 64, {message: 'user.lastNameMaxLength'});
        },
        {
            submission: {
                action: async () => {
                    const userData: UserDataDto = {
                        firstName: this.userProfileModel().firstName,
                        lastName: this.userProfileModel().lastName,
                    };
                    await firstValueFrom(this._authService.changeUserData(userData));
                },
            },
        });

    protected submitButtonDisabled = computed(() =>
        this.userProfileModel().firstName === this._userData()?.firstName
        && this.userProfileModel().lastName === this._userData()?.lastName);
}

import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { disabled, form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe, UserService } from '@core';
import { UserUpdateDto } from '@app/core/auth/user/user-update-dto.interface';
import { SvgIconComponent } from '@shared';

@Component({
    selector: 'bsa-candidate-user-data',
    imports: [
        FormRoot,
        FormField,
        TranslatePipe,
        SvgIconComponent,
    ],
    templateUrl: './user-data.component.html',
    styleUrls: [
        '../../../shared/profile-section.scss',
        './user-data.component.scss',
    ],
})
export class UserDataComponent {
    private readonly _userService = inject(UserService);
    private readonly _userData = toSignal(this._userService.user$);

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
                    this.showDataSaved.set(false);
                    const userData: UserUpdateDto = {
                        firstName: this.userProfileModel().firstName,
                        lastName: this.userProfileModel().lastName,
                    };
                    const userId = this._userData()?.id;
                    if (!userId) { return ;}
                    await firstValueFrom(this._userService.updateUser(userId, userData));
                    this.showDataSaved.set(true);
                },
            },
        });

    protected submitButtonDisabled = computed(() =>
        this.userProfileModel().firstName === this._userData()?.firstName
        && this.userProfileModel().lastName === this._userData()?.lastName);

    protected showDataSaved = signal(false);
}

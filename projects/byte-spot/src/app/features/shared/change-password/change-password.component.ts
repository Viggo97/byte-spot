import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, required, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe, UserService } from '@core';
import { SvgIconComponent } from '@shared';

@Component({
    selector: 'bsa-change-password',
    imports: [
        FormRoot,
        TranslatePipe,
        FormField,
        SvgIconComponent,
    ],
    templateUrl: './change-password.component.html',
    styleUrls: [
        '../profile-section.scss',
        './change-password.component.scss',
    ],
})
export class ChangePasswordComponent {
    private readonly _userService = inject(UserService);

    protected changePasswordModel = signal({
        oldPassword: '',
        newPassword: '',
    });

    protected changePasswordForm = form(
        this.changePasswordModel,
        (schemaPath) => {
            required(schemaPath.oldPassword, { message: 'user.passwordRequired' });

            required(schemaPath.newPassword, { message: 'user.passwordRequired' });
            minLength(schemaPath.newPassword, 8, { message: 'user.passwordMinLength' });
            maxLength(schemaPath.newPassword, 100, { message: 'user.passwordMaxLength' });

            // eslint-disable-next-line @typescript-eslint/unbound-method
            validate(schemaPath.newPassword, ({value, valueOf}) => {
                const confirmPassword = value();
                const password = valueOf(schemaPath.oldPassword);
                if (confirmPassword === password) {
                    return {
                        kind: 'passwordAreSame',
                        message: 'user.passwordAreSame',
                    };
                }
                return null;
            });
        },
        {
            submission: {
                action: async (form) => {
                    this.showDataSaved.set(false);
                    await firstValueFrom(this._userService.changePassword(this.changePasswordModel()));
                    form().reset({
                        oldPassword: '',
                        newPassword: '',
                    });
                    this.showDataSaved.set(true);
                },
            },
        },
    );

    protected showDataSaved = signal(false);
}

import { Component, inject, Signal, signal } from '@angular/core';
import { email, form, FormField, FormRoot, maxLength, minLength, required, validateAsync } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ControlLoaderDirective } from '@byte-spot-lib';
import { TranslatePipe } from '../../translate/translate.pipe';
import { AuthService } from '../auth.service';

@Component({
    selector: 'bsa-sign-up',
    imports: [
        FormField,
        FormRoot,
        TranslatePipe,
        ControlLoaderDirective,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);

    protected signUpModel = signal({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    private createEmailResource = (emailSignal: Signal<string | undefined>) => {
        return rxResource({
            params: () => emailSignal(),
            stream: ({params: email}) => this._authService.validateEmail(email),
        });
    };

    protected signUpForm = form(
        this.signUpModel,
        (schemaPath) => {
            required(schemaPath.email, {message: 'user.emailRequired'});
            email(schemaPath.email, {message: 'user.emailInvalid'});
            minLength(schemaPath.email, 4, { message: 'user.emailMinLength'});
            maxLength(schemaPath.email, 64, {message: 'user.emailMaxLength'});

            required(schemaPath.password, {message: 'user.passwordRequired'});
            minLength(schemaPath.password, 8, {message: 'user.passwordMinLength'});
            maxLength(schemaPath.password, 100, {message: 'user.passwordMaxLength'});

            required(schemaPath.firstName, {message: 'user.firstNameRequired'});
            minLength(schemaPath.firstName, 2, {message: 'user.firstNameMinLength'});
            maxLength(schemaPath.firstName, 32, {message: 'user.firstNameMaxLength'});

            required(schemaPath.lastName, {message: 'user.lastNameRequired'});
            minLength(schemaPath.lastName, 3, {message: 'user.lastNameMinLength'});
            maxLength(schemaPath.lastName, 64, {message: 'user.lastNameMaxLength'});

            validateAsync(schemaPath.email, {
                params: ({value}) => value(),
                debounce: 300,
                factory: this.createEmailResource,
                onSuccess: (result) =>
                    result ? null : {kind: 'usernameTaken', message: 'user.emailInUse'},
                onError: () => ({
                    kind: 'serverError',
                    message: 'global.unknownProblem',
                }),
            });
        },
        {
            submission: {
                action: async () => {
                    await firstValueFrom(this._authService.signUp(this.signUpModel()));
                    await this._router.navigate(['/']);
                },
            },
        });
}

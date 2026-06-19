import { Component, inject, OnDestroy, Signal, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, pattern, required, validateAsync } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { CheckboxComponent } from '@byte-spot-lib';
import { TranslatePipe } from '../../translate/translate.pipe';
import { AuthService } from '../auth.service';
import { SvgIconComponent } from '@shared';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'bsa-sign-up',
    imports: [
        FormField,
        FormRoot,
        TranslatePipe,
        CheckboxComponent,
        RouterLink,
        SvgIconComponent,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnDestroy {
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);

    protected signUpModel = signal({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isCompany: false,
        company: '',
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
            pattern(schemaPath.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                {message: 'user.emailInvalid'});
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

            required(schemaPath.company, {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                when: ({valueOf}) => valueOf(schemaPath.isCompany),
                message: 'user.companyNameRequired',
            });
            minLength(schemaPath.company, 1, {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                when: ({valueOf}) => valueOf(schemaPath.isCompany),
                message: 'user.companyNameMinLength',
            });
            maxLength(schemaPath.company, 128, {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                when: ({valueOf}) => valueOf(schemaPath.isCompany),
                message: 'user.companyNameMaxLength',
            });

            validateAsync(schemaPath.email, {
                params: ({value}) => value(),
                debounce: 300,
                factory: this.createEmailResource,
                onSuccess: () => null,
                onError: (error) => {
                    if (error instanceof HttpErrorResponse && error.status === 409) {
                        return { kind: 'usernameTaken', message: 'user.emailInUse' };
                    }
                    return { kind: 'serverError', message: 'global.unknownProblem' };
                },
            });
        },
        {
            submission: {
                action: async () => {
                    if (this.signUpModel().isCompany) {
                        const formData = this.signUpModel();
                        await firstValueFrom(this._authService.signUpCompany({
                            email: formData.email,
                            password: formData.password,
                            userFirstName: formData.firstName,
                            userLastName: formData.lastName,
                            name: formData.company,
                        }));
                    } else {
                        await firstValueFrom(this._authService.signUp(this.signUpModel()));
                    }
                    this.redirectTimeoutRef = setTimeout(() => {
                        void this._router.navigate(['/sign-in']);
                    }, 3000);
                },
            },
        });

    private redirectTimeoutRef?: number;
    protected submitted = signal(false);

    ngOnDestroy(): void {
        if (this.redirectTimeoutRef) {
            clearTimeout(this.redirectTimeoutRef);
        }
    }
}

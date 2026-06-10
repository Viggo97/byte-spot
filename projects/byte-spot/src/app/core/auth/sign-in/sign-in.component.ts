import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe } from '../../translate/translate.pipe';
import { AuthService } from '../auth.service';
import { email, form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerError } from '@shared';

@Component({
    selector: 'bsa-sign-in',
    imports: [
        FormRoot,
        FormField,
        TranslatePipe,
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
    private readonly _route= inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);

    protected signInModel = signal({
        email: '',
        password: '',
    });

    protected signInForm = form(
        this.signInModel,
        (schemaPath) => {
            required(schemaPath.email, {message: 'user.emailRequired'});
            email(schemaPath.email, {message: 'user.emailInvalid'});
            minLength(schemaPath.email, 4, { message: 'user.emailMinLength'});
            maxLength(schemaPath.email, 64, {message: 'user.emailMaxLength'});

            required(schemaPath.password, {message: 'user.passwordRequired'});
            minLength(schemaPath.password, 8, {message: 'user.passwordMinLength'});
            maxLength(schemaPath.password, 100, {message: 'user.passwordMaxLength'});
        },
        {
            submission: {
                action: async () => {
                    try {
                        await firstValueFrom(this._authService.signIn(this.signInModel()));
                        const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') ?? '/';
                        await this._router.navigateByUrl(returnUrl);
                    } catch (error: unknown) {
                        const queryParams = {errorCode: 500, errorMessage: ''};

                        if (error instanceof HttpErrorResponse) {
                            const errorMessage = ServerError.tryParse(error.error);
                            queryParams.errorMessage = errorMessage?.reason || '';
                        }
                        await this._router.navigate(['/error'], {queryParams});
                    }
                },
            },
        });
}

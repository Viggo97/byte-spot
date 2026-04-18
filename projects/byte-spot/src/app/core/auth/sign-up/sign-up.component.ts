import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { TranslatePipe } from '../../translate/translate.pipe';
import { AuthService } from '../auth.service';

/* eslint-disable @typescript-eslint/unbound-method */
@Component({
    selector: 'bsa-sign-up',
    imports: [
        ReactiveFormsModule,
        TranslatePipe,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _router = inject(Router);
    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _authService = inject(AuthService);

    protected submitDisabled = signal(false);
    protected signUpForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(64)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
        lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
    });

    protected onSignUp(): void {
        this.submitDisabled.set(true);
        const email = this.signUpForm.controls.email.getRawValue();
        const password = this.signUpForm.controls.password.getRawValue();
        const firstName = this.signUpForm.controls.firstName.getRawValue();
        const lastName = this.signUpForm.controls.lastName.getRawValue();

        this._authService.signUp({ email, password, firstName, lastName })
            .pipe(
                catchError(() => of()),
                finalize(() => {
                    this.submitDisabled.set(false);
                    void this._router.navigate(['/sign-in']);
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }
}

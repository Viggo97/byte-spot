import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { TranslatePipe } from '../../translate/translate.pipe';
import { AuthService } from '../auth.service';

/* eslint-disable @typescript-eslint/unbound-method */
@Component({
    selector: 'bsa-sign-in',
    imports: [
        ReactiveFormsModule,
        TranslatePipe,
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _route= inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _authService = inject(AuthService);

    protected submitDisabled = signal(false);
    protected signInForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(64)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    });

    protected onSignIn(): void {
        this.submitDisabled.set(true);
        const email = this.signInForm.controls.email.getRawValue();
        const password = this.signInForm.controls.password.getRawValue();

        this._authService.signIn({ email, password })
            .pipe(
                catchError(() => of()),
                finalize(() => {
                    this.submitDisabled.set(false);
                    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl') ?? '/';
                    void this._router.navigateByUrl(returnUrl);
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }
}

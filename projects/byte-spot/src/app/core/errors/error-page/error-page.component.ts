import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../translate/translate.pipe';
import { TranslateService } from '../../translate/translate.service';
import { isNumber } from '@byte-spot-lib';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'bsa-error-page',
    imports: [
        RouterLink,
        TranslatePipe,
    ],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _route = inject(ActivatedRoute);
    private readonly _translateService = inject(TranslateService);

    private readonly defaultErrorCode = 400;
    private readonly defaultErrorMessage = this._translateService.translate('global.unknownProblem');

    protected errorCode = signal(this.defaultErrorCode);
    protected errorMessage = signal(this.defaultErrorMessage);

    ngOnInit(): void {
        this._route.queryParamMap
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((queryParamMap) => {
                const errorCode = queryParamMap.get('errorCode');
                if (errorCode && isNumber(errorCode)) {
                    this.errorCode.set(+errorCode);
                } else {
                    this.errorCode.set(this.defaultErrorCode);
                }

                const errorMessage = queryParamMap.get('errorMessage');
                if (errorMessage) {
                    try {
                        const message = this._translateService.translate('global.' + errorMessage);
                        this.errorMessage.set(message);
                    } catch {
                        this.errorMessage.set(errorMessage);

                    }
                } else {
                    this.errorMessage.set(this.defaultErrorMessage);
                }
            });
    }
}

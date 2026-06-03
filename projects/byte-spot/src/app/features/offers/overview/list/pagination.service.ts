import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, Subject } from 'rxjs';
import { isNumber } from '@byte-spot-lib';
import { PaginationParams } from '@app/shared/models/pagination-params.interface';

@Injectable()
export class PaginationService {
    private readonly _route = inject(ActivatedRoute);
    private readonly _destroyRef = inject(DestroyRef);

    readonly PAGE_PARAM_KEY = 'page';

    private paginationChanged = new Subject<void>();
    paginationChanged$ = this.paginationChanged.asObservable();

    readonly limit = 10;
    page = signal(1);
    total = signal(0);

    constructor() {
        this.setPage();
        this.subscribeToQueryParamsChanges();
    }

    changePagination(): void {
        this.paginationChanged.next();
    }

    getPaginationParams(): PaginationParams {
        const page = this.page();
        return  {
            pageSize: this.limit,
            pageNumber: page,
        };
    }

    private subscribeToQueryParamsChanges(): void {
        this._route.queryParamMap
            .pipe(
                skip(1),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe(() => {
                if (!this.isPageEqualsQueryParams()) {
                    this.setPage();
                }
            });
    }

    private setPage(): void {
        const queryParams = this._route.snapshot.queryParams;
        const page = isNumber(queryParams[this.PAGE_PARAM_KEY]) ? +queryParams[this.PAGE_PARAM_KEY] : 1;
        this.page.set(page);
    }

    private isPageEqualsQueryParams(): boolean {
        const paginationValue = this.page();
        const queryValue = this._route.snapshot.queryParams;

        return paginationValue === +queryValue[this.PAGE_PARAM_KEY];
    }
}

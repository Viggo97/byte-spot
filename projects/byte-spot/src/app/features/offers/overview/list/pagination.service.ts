import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PaginationService {
    private paginationChanged = new Subject<void>();
    paginationChanged$ = this.paginationChanged.asObservable();
    private pageChanged = false;

    readonly limit = 10;
    page = signal(1);
    total = signal(0);

    changePagination(): void {
        this.pageChanged = true;
        this.paginationChanged.next();
    }

    getPaginationParams(): {pageSize: number, pageNumber: number} {
        const page = this.pageChanged ? this.page() : 1;
        const params = {
            pageSize: this.limit,
            pageNumber: page,
        };
        this.page.set(page);
        this.pageChanged = false;
        return params;
    }
}

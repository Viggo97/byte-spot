import { Component, OnDestroy, OnInit } from '@angular/core';
import { Breakpoints } from '@app/core/enums/breakpoints/breakpoints.enum';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'bsa-filters',
    standalone: true,
    imports: [],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit, OnDestroy {
    resize$ = fromEvent(window, 'resize');
    filterButtonsVisible = window.innerWidth < Breakpoints.SM;

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.initFilterIconsHandling();
    }

    private initFilterIconsHandling(): void {
        this.resize$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.filterButtonsVisible = window.innerWidth < Breakpoints.SM;
            });
    }

    onSearchOpen(): void {

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

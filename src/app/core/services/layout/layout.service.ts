import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';

import { Breakpoint } from './breakpoint.enum';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    private resize$ = fromEvent(window, 'resize');
    private resizeSource!: BehaviorSubject<Breakpoint>;

    constructor() {
        this.initResizeSource();
        this.initResizeTracking();
    }

    observe(): Observable<Breakpoint> {
        return this.resizeSource.asObservable();
    }

    private initResizeSource(): void {
        const breakpoint = this.getBreakpoint();
        this.resizeSource = new BehaviorSubject<Breakpoint>(breakpoint);
    }

    private initResizeTracking(): void {
        this.resize$.subscribe(() => {
            const breakpoint = this.getBreakpoint();
            this.resizeSource.next(breakpoint);
        });
    }

    private getBreakpoint(): Breakpoint {
        const windowWidth = window.innerWidth;
        if (windowWidth <= Breakpoint.SM) {
            return Breakpoint.SM;
        } if (windowWidth > Breakpoint.SM && windowWidth <= Breakpoint.MD) {
            return Breakpoint.MD;
        } if (windowWidth > Breakpoint.MD && windowWidth <= Breakpoint.LG) {
            return Breakpoint.LG;
        }
        return Breakpoint.XL;
    }
}

import { Observable, Subject } from 'rxjs';

export class ResizeObserverEmitter {
    private readonly element: Element;
    private resizeObserver: ResizeObserver;
    private resizeObserver$ = new Subject<ResizeObserverEntry[]>();

    constructor(element: Element) {
        this.element = element;
        this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            this.resizeObserver$.next(entries);
        });
    }

    observe(): Observable<ResizeObserverEntry[]> {
        this.resizeObserver.observe(this.element);
        return this.resizeObserver$.asObservable();
    }

    unobserve(): void {
        this.resizeObserver.unobserve(this.element);
        this.resizeObserver$.complete();
    }
}

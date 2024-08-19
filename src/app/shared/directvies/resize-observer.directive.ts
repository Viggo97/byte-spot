import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[bsaResizeObserver]',
    standalone: true,
})
export class ResizeObserverDirective implements OnInit, OnDestroy {
    observer!: ResizeObserver;

    @Output() elementResize = new EventEmitter<ResizeObserverEntry>();

    constructor(private elementRef: ElementRef) { }

    ngOnInit(): void {
        this.observer = new ResizeObserver((entries) => {
            this.elementResize.emit(entries[0]);
        });
        this.observer.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer.unobserve(this.elementRef.nativeElement);
    }
}

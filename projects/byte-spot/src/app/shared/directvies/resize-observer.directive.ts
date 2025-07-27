import { Directive, ElementRef, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[bsaResizeObserver]',
    standalone: true,
})
export class ResizeObserverDirective implements OnInit, OnDestroy {
    observer!: ResizeObserver;

    @Output() elementResize = new EventEmitter<ResizeObserverEntry>();

    private elementRef = inject(ElementRef<HTMLElement>) as ElementRef<HTMLElement>;

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

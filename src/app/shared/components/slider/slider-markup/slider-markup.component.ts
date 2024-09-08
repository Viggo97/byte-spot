import { Component, ElementRef, EventEmitter, inject, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { SliderMove } from '../slider-move.enum';

@Component({
    selector: 'bsa-slider-markup',
    standalone: true,
    imports: [],
    template: '',
    styleUrl: './slider-markup.component.scss',
})
export class SliderMarkupComponent implements OnInit, OnDestroy {
    private ngZone = inject(NgZone);
    private renderer = inject(Renderer2);
    private elementRef = inject(ElementRef<HTMLElement>);
    private document = inject(DOCUMENT);

    @Input() ratio = 0;
    @Output() changePosition = new EventEmitter<SliderMove>();

    private pointerDownListener: (() => void) | null = null;
    private pointerUpListener: (() => void) | null = null;
    private pointerMoveListener: (() => void) | null = null;

    ngOnInit(): void {
        this.elementRef.nativeElement.ondragstart = () => false;
        this.ngZone.runOutsideAngular(() => {
            this.pointerDownListener = this.renderer.listen(
                this.elementRef.nativeElement,
                'pointerdown',
                this.onPointerDown.bind(this),
            );
        });
    }

    private onPointerDown(): void {
        this.pointerUpListener = this.renderer.listen(
            this.document,
            'pointerup',
            this.onPointerUp.bind(this),
        );
        this.pointerMoveListener = this.renderer.listen(
            this.document,
            'pointermove',
            this.onPointerMove.bind(this),
        );
    }

    private onPointerUp(): void {
        this.disposePointerUpListener();
        this.disposePointerMoveListener();
    }

    private onPointerMove(event: PointerEvent): void {
        const markupPositionLeft = this.elementRef.nativeElement.getBoundingClientRect().left;
        const markupWidth = this.elementRef.nativeElement.offsetWidth;
        const markupPosition = markupPositionLeft + markupWidth / 2;
        const pointerPosition = event.pageX;

        if (pointerPosition > markupPosition + this.ratio / 2) {
            this.ngZone.run(() => {
                this.changePosition.emit(SliderMove.RIGHT);
            });
        } else if (pointerPosition <= markupPosition - this.ratio / 2) {
            this.ngZone.run(() => {
                this.changePosition.emit(SliderMove.LEFT);
            });
        }
    }

    private disposePointerDownListener(): void {
        if (this.pointerDownListener) {
            this.pointerDownListener();
        }
    }

    private disposePointerUpListener(): void {
        if (this.pointerUpListener) {
            this.pointerUpListener();
        }
    }

    private disposePointerMoveListener(): void {
        if (this.pointerMoveListener) {
            this.pointerMoveListener();
        }
    }

    ngOnDestroy(): void {
        this.disposePointerDownListener();
        this.disposePointerUpListener();
        this.disposePointerMoveListener();
    }
}

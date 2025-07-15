import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, inject, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Keycodes } from '../../../enums/keycodes.enum';
import { SliderMove } from '../slider-move.enum';

@Component({
    selector: 'bsa-slider-markup',
    imports: [],
    template: '',
    styleUrl: './slider-markup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderMarkupComponent implements OnInit, OnDestroy {
    private ngZone = inject(NgZone);
    private renderer = inject(Renderer2);
    private elementRef = inject(ElementRef<HTMLElement>);
    private document = inject(DOCUMENT);

    @Input() ratio = 0;
    @Output() changePosition = new EventEmitter<SliderMove>();

    private pointerUpListener: (() => void) | null = null;
    private pointerMoveListener: (() => void) | null = null;

    ngOnInit(): void {
        this.elementRef.nativeElement.ondragstart = () => false;
    }

    @HostListener('pointerdown')
    private onPointerDown(): void {
        this.ngZone.runOutsideAngular(() => {
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
        });
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

    @HostListener('keydown', ['$event'])
    private onKeydown($event: KeyboardEvent): void {
        const { key } = $event;
        switch (key) {
            case Keycodes.ARROW_LEFT:
                this.changePosition.emit(SliderMove.LEFT);
                break;
            case Keycodes.ARROW_RIGHT:
                this.changePosition.emit(SliderMove.RIGHT);
                break;
            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.disposePointerUpListener();
        this.disposePointerMoveListener();
    }
}

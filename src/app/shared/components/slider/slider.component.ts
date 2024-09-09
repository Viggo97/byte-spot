import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, Input, isDevMode, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { getDigitsNumber, round } from '../../utils/number.util';
import { SliderMarkupComponent } from './slider-markup/slider-markup.component';
import { SliderMove } from './slider-move.enum';

enum SliderMarkup {
    START,
    END,
}

@Component({
    selector: 'bsa-slider',
    standalone: true,
    imports: [
        SliderMarkupComponent,
    ],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit, AfterViewInit {
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);
    protected readonly SliderMarkup = SliderMarkup;

    @Input({ required: true }) min!: number;
    @Input({ required: true }) max!: number;
    @Input() step = 1;

    private _start = 0;
    get start(): number { return this._start; }
    @Input() set start(value: number) {
        if (Number.isNaN(value) || !this.valueInRange(value)) {
            this._start = this.min;
            return;
        }
        this._start = value;
    }

    private _end = 0;
    get end(): number { return this._end; }
    @Input() set end(value: number) {
        if (Number.isNaN(value) || !this.valueInRange(value)) {
            this._end = this.max;
            return;
        }
        this._end = value;
    }

    private _markupStartPosition = 0;
    get markupStartPosition(): string {
        return this.getSelfTranslation(this.start, this._markupStartPosition);
    }
    set markupStartPosition(value: number) { this._markupStartPosition = value; }

    private _markupEndPosition = 0;
    get markupEndPosition(): string {
        return this.getSelfTranslation(this.end, this._markupEndPosition);
    }
    set markupEndPosition(value: number) { this._markupEndPosition = value; }

    get stepDigits(): number { return getDigitsNumber(this.step); }
    overlappingMarkup = SliderMarkup.START;
    ratio = 0;

    @ViewChild('rail') rail!: ElementRef<HTMLDivElement>;
    @ViewChild('startMarkup', { read: ElementRef }) startMarkupRef!: ElementRef<HTMLElement>;
    @ViewChild('endMarkup', { read: ElementRef }) endMarkupRef!: ElementRef<HTMLElement>;

    ngOnInit(): void {
        fromEvent(window, 'resize')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.cdr.detectChanges();
                this.computeRatio();
                this.computeMarkupStartPosition();
                this.computeMarkupEndPosition();
            });
    }

    ngAfterViewInit(): void {
        this.computeStep();
        this.computeRatio();
        this.computeMarkupStartPosition();
        this.computeMarkupEndPosition();
        this.cdr.detectChanges();
    }

    private valueInRange(value: number): boolean {
        return this.min <= value && value <= this.max;
    }

    private getSelfTranslation(value: number, markupPosition: number): string {
        let selfTranslation;
        if (value === this.min) selfTranslation = 0;
        else if (value === this.max) selfTranslation = 100;
        else selfTranslation = 50;

        return `translateX(calc(${markupPosition}px - ${selfTranslation}%))`;
    }

    private computeStep(): void {
        const isStepDividerOfRange = Math.round((this.max - this.min) % this.step) === 0;
        if (!isStepDividerOfRange) {
            if (isDevMode()) {
                // eslint-disable-next-line no-console
                console.warn(`Step is not a divider of the range ${this.min}-${this.max}.\
                Step is computed as follow: (max - min) / 10`);
            }

            this.step = round((this.max - this.min) / 10);
        }
    }

    private computeRatio(): void {
        const graduation = (this.max - this.min) / this.step;
        const railWidth = this.rail.nativeElement.getBoundingClientRect().width;
        this.ratio = parseFloat((railWidth / graduation).toFixed(2));
    }

    private computeMarkupStartPosition(): void {
        this.markupStartPosition = (this.start / this.step) * this.ratio;
    }

    private computeMarkupEndPosition(): void {
        this.markupEndPosition = (this.end / this.step) * this.ratio;
    }

    onChangePositionMarkupStart(move: SliderMove): void {
        if (this.minReached(move) || this.endReached(move)) {
            return;
        }
        this.start += (move === SliderMove.LEFT) ? -this.step : this.step;
        this.start = round(this.start, this.stepDigits);
        this.computeMarkupStartPosition();
        this.overlappingMarkup = SliderMarkup.START;
    }

    onChangePositionMarkupEnd(move: SliderMove): void {
        if (this.maxReached(move) || this.startReached(move)) {
            return;
        }

        this.end += (move === SliderMove.LEFT) ? -this.step : this.step;
        this.end = round(this.end, this.stepDigits);
        this.computeMarkupEndPosition();
        this.overlappingMarkup = SliderMarkup.END;
    }

    private minReached(move: SliderMove): boolean {
        return move === SliderMove.LEFT && this.start === this.min;
    }

    private maxReached(move: SliderMove): boolean {
        return move === SliderMove.RIGHT && this.end === this.max;
    }

    private startReached(move: SliderMove): boolean {
        return move === SliderMove.LEFT && this.start === this.end;
    }

    private endReached(move: SliderMove): boolean {
        return move === SliderMove.RIGHT && this.start === this.end;
    }

    onRailClick(event: MouseEvent): void {
        const pointerPosition = event.pageX;
        const newValue = this.computeNewValueOnClick(pointerPosition);
        const markup = this.selectMarkupToMove(pointerPosition);
        if (markup === SliderMarkup.START) {
            this.start = newValue;
            this.computeMarkupStartPosition();
        } else {
            this.end = newValue;
            this.computeMarkupEndPosition();
        }
    }

    private selectMarkupToMove(pointerPosition: number): SliderMarkup {
        const startMarkupPosition = this.startMarkupRef.nativeElement.getBoundingClientRect().left;
        const endMarkupPosition = this.endMarkupRef.nativeElement.getBoundingClientRect().left;

        const pointerStartMarkupDiff = Math.abs(pointerPosition - startMarkupPosition);
        const pointerEndMarkupDiff = Math.abs(pointerPosition - endMarkupPosition);

        if (pointerStartMarkupDiff < pointerEndMarkupDiff) {
            return SliderMarkup.START;
        }

        if (pointerStartMarkupDiff > pointerEndMarkupDiff) {
            return SliderMarkup.END;
        }

        // Pointer int the middle
        if (pointerPosition < startMarkupPosition) {
            return SliderMarkup.START;
        }

        return SliderMarkup.END;
    }

    private computeNewValueOnClick(pointerPosition: number): number {
        const railPositionLeft = this.rail.nativeElement.getBoundingClientRect().left;
        const pointerOffsetFromRailEdge = pointerPosition - railPositionLeft;
        const stepIndex = round(pointerOffsetFromRailEdge / this.ratio);
        return round(stepIndex * this.step, this.stepDigits);
    }

    get barLeft(): string {
        return `${this._markupStartPosition}px`;
    }

    get barRight(): string {
        const railWidth = this.rail?.nativeElement.getBoundingClientRect().width || 0;
        return `${railWidth - this._markupEndPosition}px`;
    }
}

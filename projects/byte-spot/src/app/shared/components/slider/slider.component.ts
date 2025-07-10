import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, isDevMode, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { getDigitsNumber, round } from '../../utils/number.util';
import { SliderMarkupComponent } from './slider-markup/slider-markup.component';
import { SliderMove } from './slider-move.enum';
import { TooltipDirective } from '../../directvies/tooltip/tooltip.directive';

enum SliderMarkup {
    START,
    END,
}

@Component({
    selector: 'bsa-slider',
    standalone: true,
    imports: [
        SliderMarkupComponent,
        TooltipDirective,
    ],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SliderComponent,
        },
    ],
})
export class SliderComponent implements OnInit, ControlValueAccessor {
    private cdr = inject(ChangeDetectorRef);
    private elementRef = inject(ElementRef);
    protected readonly SliderMarkup = SliderMarkup;

    @Input({ required: true }) min!: number;
    @Input({ required: true }) max!: number;
    @Input() step = 1;

    @Output() valueChange = new EventEmitter<[number, number]>();

    onChange = (value: [number, number]) => {};
    onTouch = () => {};
    disabled = false;

    private _start = 0;
    get start(): number { return this._start; }
    @Input() set start(value: number) {
        if (Number.isNaN(value) || !this.valueInRange(value)) {
            this._start = this.min;
            return;
        }
        this._start = value;
        this.onChange([this.start, this.end]);
        this.valueChange.emit([this.start, this.end]);
    }

    private _end = 0;
    get end(): number { return this._end; }
    @Input() set end(value: number) {
        if (Number.isNaN(value) || !this.valueInRange(value)) {
            this._end = this.max;
            return;
        }
        this._end = value;
        this.onChange([this.start, this.end]);
        this.valueChange.emit([this.start, this.end]);
    }

    get stepDigits(): number {
        return getDigitsNumber(this.step);
    }

    get markupWidth(): number {
        return this.startMarkupRef?.nativeElement.offsetWidth || 0;
    }

    markupStartPosition = 0;
    markupEndPosition = 0;
    overlappingMarkup = SliderMarkup.START;
    ratio = 0;

    @ViewChild('rail') rail!: ElementRef<HTMLDivElement>;
    @ViewChild('startMarkup', { read: ElementRef }) startMarkupRef!: ElementRef<HTMLElement>;
    @ViewChild('endMarkup', { read: ElementRef }) endMarkupRef!: ElementRef<HTMLElement>;

    ngOnInit(): void {
        this.computeStep();
        new ResizeObserver(() => {
            this.computeRatio();
            this.computeMarkupStartPosition();
            this.computeMarkupEndPosition();
            this.cdr.detectChanges();
        }).observe(this.elementRef.nativeElement);
    }

    private valueInRange(value: number): boolean {
        return this.min <= value && value <= this.max;
    }

    private computeStep(): void {
        const isStepDividerOfRange = Math.round((this.max - this.min) % this.step) === 0;
        if (!isStepDividerOfRange) {
            if (isDevMode()) {
                // eslint-disable-next-line no-console
                console.warn(`Step is not a divider of the range ${this.min}-${this.max}.
                Step is computed as follow: (max - min) / 10`);
            }

            this.step = round((this.max - this.min) / 10);
        }
    }

    private computeRatio(): void {
        const graduation = (this.max - this.min) / this.step;
        const railWidth = this.rail.nativeElement.getBoundingClientRect().width - this.markupWidth;
        this.ratio = parseFloat((railWidth / graduation).toFixed(3));
    }

    private computeMarkupStartPosition(): void {
        this.markupStartPosition = (this.start / this.step) * this.ratio;
    }

    private computeMarkupEndPosition(): void {
        this.markupEndPosition = (this.end / this.step) * this.ratio;
    }

    onChangePositionMarkupStart(move: SliderMove): void {
        if (this.disabled) {
            return;
        }

        if (this.minReached(move) || this.endReached(move)) {
            return;
        }
        const newStart = this.start + ((move === SliderMove.LEFT) ? -this.step : this.step);
        this.start = round(newStart, this.stepDigits);
        this.computeMarkupStartPosition();
        this.overlappingMarkup = SliderMarkup.START;
    }

    onChangePositionMarkupEnd(move: SliderMove): void {
        if (this.disabled) {
            return;
        }

        if (this.maxReached(move) || this.startReached(move)) {
            return;
        }

        const newEnd = this.end + ((move === SliderMove.LEFT) ? -this.step : this.step);
        this.end = round(newEnd, this.stepDigits);
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
        if (this.disabled) {
            return;
        }

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
        const stepIndex = round((pointerOffsetFromRailEdge - this.markupWidth / 2) / this.ratio);
        return round(stepIndex * this.step, this.stepDigits);
    }

    get barLeft(): string {
        return `${this.markupStartPosition + this.markupWidth / 2}px`;
    }

    get barRight(): string {
        const railWidth = this.rail?.nativeElement.getBoundingClientRect().width || 0;
        return `${railWidth - this.markupEndPosition - this.markupWidth / 2}px`;
    }

    registerOnChange(onChange: (value: [number, number]) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouch: () => void): void {
        this.onTouch = onTouch;
    }

    writeValue(value: [number, number]): void {
        if (!value) {
            return;
        }
        const [start, end] = value;
        this.start = start;
        this.end = end;
        this.computeMarkupStartPosition();
        this.computeMarkupEndPosition();
        this.cdr.markForCheck();
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }
}

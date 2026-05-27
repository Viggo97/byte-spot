import {ChangeDetectionStrategy,
    Component,
    computed, effect,
    ElementRef,
    inject,
    input,
    model,
    OnDestroy,
    OnInit,
    signal,
    viewChild,
    ViewEncapsulation} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';
import {Range} from './range.model';
import {RangeThumbComponent} from './range-thumb/range-thumb.component';
import {RangeMoveDirection} from './range-move-direction.enum';
import {getDigitsNumber, round} from '../../utils/number.util';

enum Thumb {
    FROM = 'from',
    TO = 'to',
}

@Component({
    selector: 'bsl-range',
    imports: [
        RangeThumbComponent,
    ],
    templateUrl: './range.component.html',
    styleUrl: './range.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.aria-label]': 'null',
        '[attr.aria-labelledby]': 'null',
    },
})
export class RangeComponent implements FormValueControl<Range>, OnInit, OnDestroy {
    private elementRef = inject(ElementRef<HTMLElement>) as ElementRef<HTMLElement>;

    minValue = input(0);
    maxValue = input(5);
    step = input(1);
    value = model(new Range(0, 5));
    ariaLabel = input<string | null>(null, {alias: 'aria-label'});
    ariaLabelledBy = input<string | null>(null, {alias: 'aria-labelledby'});
    showThumbLabels = input(false);
    disabled = input(false);

    protected thumbFromRef = viewChild.required<RangeThumbComponent, ElementRef<HTMLElement>>('thumbFrom',
        {read: ElementRef<HTMLElement>});
    protected thumbToRef = viewChild.required<RangeThumbComponent, ElementRef<HTMLElement>>('thumbTo',
        {read: ElementRef<HTMLElement>});

    protected _step = signal(1);
    protected ratio = signal(0);
    protected thumbFromPosition = signal(0);
    protected thumbToPosition = signal(0);
    protected overlappingThumb = signal(Thumb.FROM);
    private stepDigits = computed(() => getDigitsNumber(this._step()));
    private thumbWidth = computed(() => this.thumbFromRef().nativeElement.offsetWidth || 0);
    protected trackerLeft = computed(() => `${this.thumbFromPosition() + this.thumbWidth() / 2}px`);
    protected trackerRight = computed(() => {
        const railWidth = this.elementRef.nativeElement.getBoundingClientRect().width || 0;
        return `${railWidth - this.thumbToPosition() - this.thumbWidth() / 2}px`;
    });

    protected readonly Thumb = Thumb;
    private resizeObserver!: ResizeObserver;

    constructor() {
        effect(() => {
            console.log('range');
            this.value();
            this.computeFromThumbPosition();
            this.computeToThumbPosition();
        });
    }

    ngOnInit(): void {
        this.validateRange();
        this.validateStep();
        this.initResizeObserver();
    }

    private validateRange(): void {
        let range: Range | null = null;

        if (Number.isNaN(this.value().from) || !this.valueInRange(this.value().from)) {
            range = new Range(this.minValue(), this.value().to);
        }

        if (Number.isNaN(this.value().to) || !this.valueInRange(this.value().to)) {
            if (range) {
                range.to = this.maxValue();
            } else {
                range = new Range(this.value().from, this.maxValue());
            }
        }

        if (this.value().from > this.value().to) {
            if (range) {
                range.from = this.minValue();
                range.to = this.maxValue();
            } else {
                range = new Range(this.minValue(), this.maxValue());
            }
        }

        if (range) {
            this.value.update(() => range);
        }
    }

    private valueInRange(value: number): boolean {
        return this.minValue() <= value && value <= this.maxValue();
    }

    private validateStep(): void {
        const isStepDividerOfRange = (this.maxValue() - this.minValue()) % this.step() === 0;
        const step = isStepDividerOfRange
            ? this.step()
            : parseFloat(((this.maxValue() - this.minValue()) / 10).toFixed(0));
        this._step.set(step);
    }

    private initResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.computeRatio();
            this.computeFromThumbPosition();
            this.computeToThumbPosition();
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    private computeRatio(): void {
        const graduation = (this.maxValue() - this.minValue()) / this._step();
        const hostWidth = this.elementRef.nativeElement.offsetWidth - this.thumbWidth();
        this.ratio.set(parseFloat((hostWidth / graduation).toFixed(3)));
    }

    private computeFromThumbPosition(): void {
        this.thumbFromPosition.set((this.value().from / this._step()) * this.ratio());
    }

    private computeToThumbPosition(): void {
        this.thumbToPosition.set(this.value().to / this._step() * this.ratio());
    }

    protected onPositionChangedThumbFrom(direction: RangeMoveDirection): void {
        if (this.disabled()) {
            return;
        }

        if (this.minReached(direction) || this.toReached(direction)) {
            return;
        }

        const diff = direction === RangeMoveDirection.BACKWARD ? -this._step() : this._step();
        const newFrom = this.value().from + diff;
        this.value.update((value) => new Range(round(newFrom, this.stepDigits()), value.to));
        this.overlappingThumb.set(Thumb.FROM);
    }

    protected onPositionChangedThumbTo(direction: RangeMoveDirection): void {
        if (this.disabled()) {
            return;
        }

        if (this.maxReached(direction) || this.fromReached(direction)) {
            return;
        }

        const diff = direction === RangeMoveDirection.BACKWARD ? -this._step() : this._step();
        const newTo = this.value().to + diff;
        this.value.update((value) => new Range(value.from, round(newTo, this.stepDigits())));
        this.overlappingThumb.set(Thumb.TO);
    }

    private minReached(direction: RangeMoveDirection): boolean {
        return direction === RangeMoveDirection.BACKWARD && this.value().from === this.minValue();
    }

    private maxReached(direction: RangeMoveDirection): boolean {
        return direction === RangeMoveDirection.FORWARD && this.value().to === this.maxValue();
    }

    private fromReached(direction: RangeMoveDirection): boolean {
        return direction === RangeMoveDirection.BACKWARD && this.value().from === this.value().to;
    }

    private toReached(direction: RangeMoveDirection): boolean {
        return direction === RangeMoveDirection.FORWARD && this.value().from === this.value().to;
    }

    protected onRailClick(event: MouseEvent): void {
        if (this.disabled()) {
            return;
        }

        const pointerPosition = event.pageX;
        const newValue = this.computeNewValueOnClick(pointerPosition);
        const thumb = this.selectThumbToMove(pointerPosition);
        if (thumb === Thumb.FROM) {
            this.value.update((value) => new Range(newValue, value.to));
        } else {
            this.value.update((value) => new Range(value.from, newValue));
        }
    }

    private computeNewValueOnClick(pointerPosition: number): number {
        const hostPositionLeft = this.elementRef.nativeElement.getBoundingClientRect().left;
        const pointerOffsetFromHostEdge = pointerPosition - hostPositionLeft;
        const stepIndex = round((pointerOffsetFromHostEdge - this.thumbWidth() / 2) / this.ratio());
        return round(stepIndex * this._step(), this.stepDigits());
    }

    private selectThumbToMove(pointerPosition: number): Thumb {
        const fromThumbPosition = this.thumbFromRef().nativeElement.getBoundingClientRect().left;
        const toThumbPosition = this.thumbToRef().nativeElement.getBoundingClientRect().left;

        const pointerFromThumbDiff = Math.abs(pointerPosition - fromThumbPosition);
        const pointerToThumbDiff = Math.abs(pointerPosition - toThumbPosition);

        if (pointerFromThumbDiff < pointerToThumbDiff) {
            return Thumb.FROM;
        }

        if (pointerFromThumbDiff > pointerToThumbDiff) {
            return Thumb.TO;
        }

        // Pointer in the middle
        if (pointerPosition < pointerFromThumbDiff) {
            return Thumb.FROM;
        }

        return Thumb.TO;
    }

    ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }
}

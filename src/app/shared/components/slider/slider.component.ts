import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'bsa-slider',
    standalone: true,
    imports: [],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
})
export class SliderComponent implements OnInit, AfterViewInit {
    @Input({ required: true }) min!: number;
    @Input({ required: true }) max!: number;
    @Input() step = 1;
    @Input() valueStart = 0;
    @Input() valueEnd = 0;

    private cdr = inject(ChangeDetectorRef);

    private _markupStartPosition = 0;
    private _markupEndPosition = 0;

    @ViewChild('rail') rail!: ElementRef<HTMLDivElement>;

    ngOnInit(): void {
        if (!this.valueStart) {
            this.valueStart = this.min;
        }
        if (!this.valueEnd) {
            this.valueEnd = this.max;
        }
    }

    ngAfterViewInit(): void {
        this.setMarkupPosition();
        this.cdr.detectChanges();
    }

    setMarkupPosition(): void {
        const ranges = (this.max - this.min) / this.step;
        const railWidth = this.rail.nativeElement.getBoundingClientRect().width;
        this.markupStartPosition = this.valueStart * (railWidth / ranges);
        this.markupEndPosition = this.valueEnd * (railWidth / ranges);
    }

    get markupStartPosition(): string {
        return `translateX(calc(${this._markupStartPosition}px - ${this.min === this.valueStart ? '0%' : '50%'}))`;
    }

    set markupStartPosition(value: number) {
        this._markupStartPosition = value;
    }

    get markupEndPosition(): string {
        return `translateX(calc(${this._markupEndPosition}px - ${this.max === this.valueEnd ? '100%' : '50%'}))`;
    }

    set markupEndPosition(value: number) {
        this._markupEndPosition = value;
    }
}

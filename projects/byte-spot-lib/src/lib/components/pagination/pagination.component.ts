import {ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    input,
    model,
    signal,
    viewChild,
    ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'bsl-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class PaginationComponent {
    page = model(1);
    total = input(1);
    size = input(10);
    nextPageAriaLabel = input('Next page');
    previousPageAriaLabel = input('Previous page');
    firstPageAriaLabel = input('First page');
    lastPageAriaLabel = input('Last page');
    selectPageAriaLabel = input('Select page');
    selectPageAriaLabelledBy = input<string | null>(null);

    protected inputRef = viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

    protected pages = computed(() => Math.ceil(this.total() / this.size()));
    protected disabled = signal(false);

    protected onInputBlur(): void {
        this.inputRef().nativeElement.value = this.page().toString();
    }

    protected onInputEnter(value: number): void {
        if (isNaN(value) || value < 1) {
            this.page.set(1);
            this.inputRef().nativeElement.value = this.page().toString();
            this.inputRef().nativeElement.focus();
        }
        else if (value > this.pages()) {
            this.page.set(this.pages());
            this.inputRef().nativeElement.value = this.page().toString();
            this.inputRef().nativeElement.focus();
        }
        else {
            this.page.set(value);
        }
    }

    protected onNextPage(event: PointerEvent): void {
        if (this.page() < this.pages()) {
            this.page.update(value => value + 1);
        }
        if (event.pointerType === '' && this.page() === this.pages()) {
            this.inputRef().nativeElement.focus();
        }
    }

    protected onPreviousPage(event: PointerEvent): void {
        if (this.page() > 1) {
            this.page.update(value => value - 1);
        }
        if (event.pointerType === '' && this.page() === 1) {
            this.inputRef().nativeElement.focus();
        }
    }

    protected onFirstPage(event: PointerEvent): void {
        this.page.set(1);
        if (event.pointerType === '') {
            this.inputRef().nativeElement.focus();
        }
    }

    protected onLastPage(event: PointerEvent): void {
        this.page.set(this.pages());
        if (event.pointerType === '') {
            this.inputRef().nativeElement.focus();
        }
    }
}

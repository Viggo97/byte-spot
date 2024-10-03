import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'bsa-pagination',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
    @Input({ required: true }) total!: number;
    @Input({ required: true }) limit!: number;
    @Input() set currentPage(value: number) {
        this.page = value;
    }
    @Input() disabled = false;

    @Output() pageChange = new EventEmitter<number>();

    page = 1;
    pages = 1;

    ngOnChanges(): void {
        if (this.total && this.limit) {
            this.computePages();
        }
    }

    private computePages(): void {
        this.pages = Math.ceil(this.total / this.limit);
    }

    onInputBlur(): void {
        if (!this.page || this.page < 0) {
            this.page = 1;
        }

        if (this.page > this.pages) {
            this.page = this.pages;
        }

        this.emitPage();
    }

    onInputEnter(): void {
        this.emitPage();
    }

    onNextPage(): void {
        if (this.page < this.pages) {
            this.page += 1;
            this.emitPage();
        }
    }

    onPreviousPage(): void {
        if (this.page > 1) {
            this.page -= 1;
            this.emitPage();
        }
    }

    onFirstPage(): void {
        this.page = 1;
        this.emitPage();
    }

    onLastPage(): void {
        this.page = this.pages;
        this.emitPage();
    }

    private emitPage(): void {
        this.pageChange.emit(this.page);
    }
}

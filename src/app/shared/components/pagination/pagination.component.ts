import {
    Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { SelectComponent } from '@app/shared/components/select/select.component';

@Component({
    selector: 'bsa-pagination',
    standalone: true,
    imports: [
        SelectComponent,
    ],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
    @Input({ required: true }) total!: number;
    @Input() perPage = 20;

    @Input() set currentPage(value: number) {
        this.page = value;
    }

    @Output() pageChange = new EventEmitter<number>();

    page = 1;
    pages = 1;

    ngOnInit(): void {
        this.pages = this.total / this.perPage;
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

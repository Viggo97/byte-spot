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
    @Input() options: number[] = [];

    @Input() set currentPage(value: number) {
        this.page = value;
    }

    @Output() pageChange = new EventEmitter<number>();

    page = 1;
    pages = 1;
    optionsMap = new Map<string, string>();

    ngOnInit(): void {
        this.pages = this.total / this.perPage;
        this.setOptions();
    }

    private setOptions(): void {
        if (this.options.length > 0) {
            this.options.forEach((o) => this.optionsMap.set(o.toString(), o.toString()));
        } else {
            this.optionsMap = new Map<string, string>()
                .set('10', '10')
                .set('20', '20')
                .set('50', '50')
                .set('100', '100');
        }
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

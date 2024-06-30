import {
    Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { SelectComponent } from '@app/shared/components/select/select.component';

@Component({
    selector: 'bsa-pages-manager',
    standalone: true,
    imports: [
        SelectComponent,
    ],
    templateUrl: './pages-manager.component.html',
    styleUrl: './pages-manager.component.scss',
})
export class PagesManagerComponent implements OnInit {
    @Input() options: number[] = [];
    @Input() perPage = 20;
    @Input({ required: true }) total!: number;
    @Input() set currentPage(value: number) {
        this.page = value;
    }

    @Output() pageChange = new EventEmitter<number>();

    page = 1;
    pages = 1;
    selectOptions: DropdownItem<number>[] = [];

    ngOnInit(): void {
        this.pages = this.total / this.perPage;
        this.setOptions();
    }

    private setOptions(): void {
        if (this.options.length > 0) {
            this.options.forEach((o) => {
                this.selectOptions.push({
                    key: o,
                    value: o,
                    label: o.toString(),
                });
            });
        } else {
            this.selectOptions = [
                { key: 10, value: 10, label: '10' },
                { key: 20, value: 20, label: '20' },
                { key: 50, value: 50, label: '50' },
                { key: 100, value: 100, label: '100' },
            ];
        }
    }

    onSelectOption(option: DropdownItem<number>): void {

    }
}

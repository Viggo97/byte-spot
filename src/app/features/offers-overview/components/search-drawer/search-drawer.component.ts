import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/features/offers-overview/components/input/input.component';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { SuggestionsComponent } from '@app/features/offers-overview/components/suggestions/suggestions.component';
import { SearchBase } from '@app/features/offers-overview/model/search-base';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';

@Component({
    selector: 'bsa-search-drawer',
    standalone: true,
    imports: [
        DrawerComponent,
        InputComponent,
        ReactiveFormsModule,
        SearchComponent,
        SuggestionsComponent,
    ],
    templateUrl: 'search-drawer.component.html',
    styleUrls: ['./search-drawer.component.scss'],
})
export class SearchDrawerComponent extends SearchBase implements OnInit, OnDestroy {
    @Input({ required: true }) searchPhrase!: string;

    @Output() searchPhraseSelected = new EventEmitter<string>();
    @Output() closeDrawer = new EventEmitter<void>();

    @ViewChild(DrawerComponent) drawer!: DrawerComponent;

    constructor(offersService: OffersService) {
        super(offersService);
    }

    ngOnInit(): void {
        this.initForm(this.searchPhrase);
        this.getInputValueChanges().subscribe((suggestions) => {
            this.suggestions = suggestions;
        });
    }

    onSuggestionSelected(item: DropdownItem): void {
        this.suggestions = [];
        this.form.setValue(item.value, { emitEvent: false });
        this.searchPhraseSelected.emit(item.value);
    }

    onCloseDrawer(): void {
        this.closeDrawer.emit();
    }

    close(): void {
        this.drawer.close();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

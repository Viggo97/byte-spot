import {
    Component, EventEmitter, OnInit, Output, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/features/offers-overview/components/input/input.component';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { SuggestionsComponent } from '@app/features/offers-overview/components/suggestions/suggestions.component';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { Drawer } from '@app/shared/models/drawer.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
    selector: 'bsa-search-drawer',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        SearchComponent,
        DrawerComponent,
        SuggestionsComponent,
        InputComponent,
    ],
    templateUrl: 'search-drawer.component.html',
    styleUrls: ['./search-drawer.component.scss'],
})
export class SearchDrawerComponent implements Drawer, OnInit {
    form = new FormControl<string>('');
    suggestions: SuggestionsGroup[] = [];

    @ViewChild(DrawerComponent) drawer!: DrawerComponent;

    @Output() closeDrawer = new EventEmitter<void>();

    constructor(private offersService: OffersService) {
    }

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
            )
            .subscribe((value) => {
                this.suggestions = value;
            });
    }

    onCloseDrawer(): void {
        this.closeDrawer.emit();
    }

    close(): void {
        this.drawer.close();
    }
}

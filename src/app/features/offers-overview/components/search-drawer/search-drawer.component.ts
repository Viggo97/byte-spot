import {
    Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/features/offers-overview/components/input/input.component';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { SuggestionsComponent } from '@app/features/offers-overview/components/suggestions/suggestions.component';
import { SearchBase } from '@app/features/offers-overview/model/search-base';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';

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
export class SearchDrawerComponent extends SearchBase implements OnInit, OnDestroy {
    @ViewChild(DrawerComponent) drawer!: DrawerComponent;

    @Output() closeDrawer = new EventEmitter<void>();

    constructor(offersService: OffersService) {
        super(offersService);
    }

    ngOnInit(): void {
        this.getInputValueChanges().subscribe((value) => {
            this.suggestions = value;
        });
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

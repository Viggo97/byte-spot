import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';

import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';

import { OfferSearchBase } from '../offer-search-base';
import { OffersService } from '../../offers.service';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offer-search-drawer',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        DrawerComponent,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: 'offer-search-drawer.component.html',
    styleUrls: ['./offer-search-drawer.component.scss'],
})
export class OfferSearchDrawerComponent extends OfferSearchBase implements OnInit, OnDestroy {
    @Input({ required: true }) searchPhrase!: string;

    @Output() searchPhraseSelected = new EventEmitter<string>();

    @ViewChild(DrawerComponent) drawer!: DrawerComponent;

    drawerOpen = false;
    scrollStrategy = this.overlay.scrollStrategies.block();

    constructor(
        offersService: OffersService,
        private overlay: Overlay,
    ) {
        super(offersService);
    }

    ngOnInit(): void {
        this.initForm(this.searchPhrase);
        this.getInputValueChanges().subscribe((suggestions) => {
            this.suggestions = suggestions;
        });
    }

    onSuggestionSelected(item: DropdownItem<string>): void {
        this.suggestions = [];
        this.form.setValue(item.value, { emitEvent: false });
        this.searchPhraseSelected.emit(item.value);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

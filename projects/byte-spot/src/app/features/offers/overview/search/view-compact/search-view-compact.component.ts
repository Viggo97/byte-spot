import { Component, inject, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { DrawerComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { SearchService } from '../search.service';
import { SearchFormComponent } from '../form/search-form.component';

@Component({
    selector: 'bsa-offers-overview-search-view-compact',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        DrawerComponent,
        SearchFormComponent,
        FormField,
    ],
    templateUrl: './search-view-compact.component.html',
    styleUrl: './search-view-compact.component.scss',
})
export class SearchViewCompactComponent {
    private overlay = inject(Overlay);
    private searchService = inject(SearchService);

    readonly scrollStrategy = this.overlay.scrollStrategies.block();

    protected searchPhrase = this.searchService.searchForm.phrase;
    protected drawerOpen = signal(false);

    protected onInputClick(event?: KeyboardEvent): void {
        const code = event?.code;
        if (event && code !== 'Space' && code !== 'Enter') {
            return;
        }

        if (event?.key === 'Enter') {
            event.preventDefault();
        }

        this.openDrawer();
    }

    protected openDrawer(): void {
        this.drawerOpen.set(true);
    }

    protected closeDrawer(): void {
        this.drawerOpen.set(false);
    }

    protected focusCombobox(): void {
        setTimeout(() => {
            const input = document.querySelector('bsl-combobox input');
            if (input) {
                (input as HTMLInputElement).focus();
            }
        });
    }

    protected onConfirmSelection(): void {
        this.closeDrawer();
        this.searchService.changeSearch();
    }
}

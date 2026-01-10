import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { DrawerComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { SearchService } from '../search.service';
import { SearchFormComponent } from '../form/search-form.component';

@Component({
    selector: 'bsa-offers-overview-search-view-compact',
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        DrawerComponent,
        SearchFormComponent,
    ],
    templateUrl: './search-view-compact.component.html',
    styleUrl: './search-view-compact.component.scss',
})
export class SearchViewCompactComponent {
    private overlay = inject(Overlay);
    private searchService = inject(SearchService);

    readonly scrollStrategy = this.overlay.scrollStrategies.block();

    protected searchValue = signal(this.searchService.searchForm);
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
            const input = document.querySelector('ngx-bsl-combobox input');
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

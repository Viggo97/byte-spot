import { Component, EventEmitter } from '@angular/core';
import { SearchComponent } from '@app/features/offers-overview/components/search/search.component';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { Drawer } from '@app/shared/models/drawer.interface';

@Component({
    selector: 'bsa-search-drawer',
    standalone: true,
    imports: [
        SearchComponent,
        DrawerComponent,
    ],
    template: `
        <bsa-drawer [title]="'global.search'"
                    (closeDrawer)="onCloseDrawer()">
            <bsa-search></bsa-search>
        </bsa-drawer>
    `,
})
export class SearchDrawerComponent implements Drawer {
    closeDrawer = new EventEmitter<void>();

    onCloseDrawer(): void {
        this.closeDrawer.emit();
    }
}

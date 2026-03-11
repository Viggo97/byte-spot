import { Component, computed, inject } from '@angular/core';
import { NumberFormatterPipe } from '@shared';
import { TranslatePipe } from '@core';
import { InfoService } from './info.service';

@Component({
    selector: 'bsa-offers-overview-info',
    imports: [
        NumberFormatterPipe,
        TranslatePipe,
    ],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
})
export class InfoComponent {
    private infoService = inject(InfoService);
    numberOfOffers = computed(() => this.infoService.total());
}

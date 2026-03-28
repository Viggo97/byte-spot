import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@core';

@Component({
    selector: 'bsa-offers-details-deadline',
    imports: [
        TranslatePipe,
    ],
    templateUrl: './deadline.component.html',
    styleUrl: './deadline.component.scss',
})
export class DeadlineComponent {
    validFrom = input.required<number>();
    validTo = input.required<number>();
    protected expires = computed(() => new Date(this.validTo()).toLocaleDateString());
    protected leftDays = computed(() => {
        const leftTimestamp = this.validTo() - Date.now();
        const leftDays = leftTimestamp / (24 * 60 * 60 * 1000);
        return Math.ceil(leftDays);
    });
    protected progress = computed(() => {
        const total = this.validTo() - this.validFrom();
        const timePassed = Date.now() - this.validFrom();
        return Math.floor(timePassed * 100 / total);
    });
}


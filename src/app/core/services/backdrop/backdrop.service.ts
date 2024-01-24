import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BackdropService {
    backdrop: HTMLDivElement | null = null;

    constructor() {
        this.backdrop = document.getElementsByClassName('backdrop')[0] as HTMLDivElement;
    }

    showBackdrop(showBackground = false): void {
        this.backdrop!.classList.add('backdrop-show');
        if (showBackground) {
            this.backdrop!.classList.add('backdrop-background');
        }
    }

    hideBackdrop(): void {
        this.backdrop!.classList.remove('backdrop-show');
        this.backdrop!.classList.remove('backdrop-background');
    }
}

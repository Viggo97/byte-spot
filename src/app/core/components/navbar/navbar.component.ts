import { Component } from '@angular/core';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    darkMode = false;

    switchMode(): void {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode');
    }
}

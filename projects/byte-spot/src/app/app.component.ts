import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '@core';
import { ByteSpotLibComponent } from "@byte-spot-lib";

@Component({
    selector: 'bsa-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent, ByteSpotLibComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'byte-spot';
}

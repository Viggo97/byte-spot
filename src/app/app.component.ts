import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './core/components/navbar/navbar.component';
import { LanguageService } from './core/services/language/language.service';

@Component({
    selector: 'bsa-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'byte-spot';
    lang: any;

    constructor(private languageService: LanguageService) {
    }

    ngOnInit(): void {
        this.lang = this.languageService.lang;
    }
}

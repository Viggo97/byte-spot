import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';

import { DropdownContainerComponent } from '../../../shared/components/dropdown-container/dropdown-container.component';
import { Language } from '../../enums/language/language.enum';
import { EdgeX, EdgeY } from '../../enums/overlay/relative-position-edge.enum';
import { Theme } from '../../enums/theme/theme.enum';
import { LanguageService } from '../../services/language/language.service';
import { OverlayService } from '../../services/overlay/overlay.service';
import { ThemeService } from '../../services/theme/theme.service';
import { TranslateService } from '../../services/translate/translate.service';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [NgClass, DropdownContainerComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    @ViewChild('languageButton') languageButton: ElementRef<HTMLButtonElement> | null = null;

    darkTheme: boolean = false;

    constructor(
        private languageService: LanguageService,
        private overlayService: OverlayService<DropdownContainerComponent>,
        private themeService: ThemeService,
        private translateService: TranslateService,
    ) {
        this.themeService.theme$.subscribe((theme) => {
            this.darkTheme = theme === Theme.DARK;
        });
    }

    onSwitchTheme(): void {
        this.themeService.switchTheme();
    }

    onChangeLanguage(): void {
        const languageOptions = new Map<string, string>()
            .set(Language.ENGLISH, this.translateService.translate('global.languageEN'))
            .set(Language.POLISH, this.translateService.translate('global.languagePL'));

        const dropdownContainerRef = this.overlayService.show(DropdownContainerComponent, {
            componentInputs: [
                { name: 'options', value: languageOptions },
            ],
            backdrop: {
                background: false,
            },
            relativePosition: {
                relativeElement: this.languageButton!.nativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.LEFT,
                    contentEdge: EdgeX.RIGHT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.BOTTOM,
                    contentEdge: EdgeY.TOP,
                },
            },
        });

        dropdownContainerRef?.instance.selectOption
            .pipe(takeUntil(this.overlayService.close$))
            .subscribe((value) => {
                this.languageService.setLanguage(value.key as Language);
                this.overlayService.close();
            });
    }
}

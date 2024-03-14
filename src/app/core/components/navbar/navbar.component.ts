import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Language } from '@app/core/enums/language/language.enum';
import { EdgeX, EdgeY } from '@app/core/enums/overlay/relative-position-edge.enum';
import { Theme } from '@app/core/enums/theme/theme.enum';
import { LanguageService } from '@app/core/services/language/language.service';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { ThemeService } from '@app/core/services/theme/theme.service';
import { TranslateService } from '@app/core/services/translate/translate.service';
import { DropdownContainerComponent } from '@app/shared/components/dropdown-container/dropdown-container.component';
import { takeUntil } from 'rxjs';

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

        const overlayConfig = {
            componentInputs: [
                { name: 'options', value: languageOptions },
            ],
            backdrop: {
                background: false,
            },
            relativePosition: {
                relativeElement: this.languageButton!.nativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.RIGHT,
                    contentEdge: EdgeX.RIGHT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.BOTTOM,
                    contentEdge: EdgeY.TOP,
                },
                width: 128,
            },
        };

        const [dropdownContainerRef, close$] = this.overlayService.show(DropdownContainerComponent, overlayConfig);

        dropdownContainerRef?.instance.selectOption
            .pipe(takeUntil(close$))
            .subscribe((value) => {
                this.languageService.setLanguage(value.key as Language);
                this.overlayService.close();
            });
    }
}

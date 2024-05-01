import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Language } from '@app/core/enums/language/language.enum';
import { Theme } from '@app/core/enums/theme/theme.enum';
import { LanguageService } from '@app/core/services/language/language.service';
import { ThemeService } from '@app/core/services/theme/theme.service';
import { TranslateService } from '@app/core/services/translate/translate.service';
import { DropdownContainerComponent } from '@app/shared/components/dropdown-container/dropdown-container.component';
import { DropdownOption } from '@app/shared/models/dropdown-container/dropdown-option';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [NgClass, DropdownContainerComponent, CdkConnectedOverlay, CdkOverlayOrigin],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    @ViewChild('languageButton') languageButton: ElementRef<HTMLButtonElement> | null = null;

    protected darkTheme: boolean = false;
    protected languageOptions = new Map<string, string>()
        .set(Language.ENGLISH, this.translateService.translate('global.languageEN'))
        .set(Language.POLISH, this.translateService.translate('global.languagePL'));
    protected languageDropdownOpen = false;

    constructor(
        private languageService: LanguageService,
        private themeService: ThemeService,
        private translateService: TranslateService,
        private elementRef: ElementRef,
    ) {
        this.themeService.theme$.subscribe((theme) => {
            this.darkTheme = theme === Theme.DARK;
        });
    }

    protected onSwitchTheme(): void {
        this.themeService.switchTheme();
    }

    protected onOutsideClick(event: MouseEvent): void {
        if (this.elementRef.nativeElement.contains(event.target)) {
            event.stopPropagation();
        }

        this.languageDropdownOpen = false;
    }

    protected onSelectOption(value: DropdownOption): void {
        this.languageService.setLanguage(value.key as Language);
    }
}

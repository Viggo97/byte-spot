import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '@app/core/components/navbar/navbar.component';
import { Language } from '@app/core/enums/language/language.enum';
import { Theme } from '@app/core/enums/theme/theme.enum';
import { LanguageService } from '@app/core/services/language/language.service';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { ThemeService } from '@app/core/services/theme/theme.service';
import { BehaviorSubject, of } from 'rxjs';

class ThemeServiceStub {
    theme = new BehaviorSubject<Theme>(Theme.LIGHT);
    theme$ = this.theme.asObservable();
    switchTheme(): void {
        const newTheme = this.theme.value === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        this.theme.next(newTheme);
    }
}

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let overlayService: any;
    let languageService: LanguageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [
                { provide: ThemeService, useClass: ThemeServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        overlayService = TestBed.inject(OverlayService);
        languageService = TestBed.inject(LanguageService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should switch theme', () => {
        const spy = spyOn(component, 'onSwitchTheme').and.callThrough();
        const switchThemeButton = fixture.nativeElement.querySelector('#switch-theme-button') as HTMLButtonElement;

        expect(component.darkTheme).toBeFalse();
        expect(switchThemeButton).toHaveClass('icon-sun');

        switchThemeButton.click();
        fixture.detectChanges();

        expect(component.darkTheme).toBeTrue();
        expect(switchThemeButton).toHaveClass('icon-moon');
        expect(spy).toHaveBeenCalled();
    });

    it('should change language', () => {
        const changeLanguageSpy = spyOn(component, 'onChangeLanguage').and.callThrough();
        const setLanguageSpy = spyOn(languageService, 'setLanguage').and.callThrough();
        const outputStub = new EventEmitter<any>();
        const showOverlaySpy = spyOn(overlayService, 'show')
            .and.returnValue([{ instance: { selectOption: outputStub } }, of()]);
        const closeOverlaySpy = spyOn(overlayService, 'close')
            .and.returnValue(null);
        const changeLanguageButton = fixture.nativeElement
            .querySelector('#change-language-button') as HTMLButtonElement;

        changeLanguageButton.click();
        outputStub.emit({ key: Language.ENGLISH, value: 'English' });

        expect(changeLanguageSpy).toHaveBeenCalled();
        expect(setLanguageSpy).toHaveBeenCalledOnceWith(Language.ENGLISH);
        expect(showOverlaySpy).toHaveBeenCalled();
        expect(closeOverlaySpy).toHaveBeenCalled();
    });
});

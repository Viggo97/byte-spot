// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NavbarComponent } from '@app/core/components/navbar/navbar.component';
// import { Language } from '@app/core/language/language.enum';
// import { Theme } from '@app/core/enums/theme/theme.enum';
// import { LanguageService } from '@app/core/language/language.service';
// import { ThemeService } from '@app/core/services/theme/theme.service';
// import { BehaviorSubject } from 'rxjs';
//
// class ThemeServiceStub {
//     theme = new BehaviorSubject<Theme>(Theme.LIGHT);
//     theme$ = this.theme.asObservable();
//     switchTheme(): void {
//         const newTheme = this.theme.value === Theme.DARK ? Theme.LIGHT : Theme.DARK;
//         this.theme.next(newTheme);
//     }
// }
//
// describe('NavbarComponent', () => {
//     let component: NavbarComponent;
//     let fixture: ComponentFixture<NavbarComponent>;
//     let languageService: LanguageService;
//
//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [NavbarComponent],
//             providers: [
//                 { provide: ThemeService, useClass: ThemeServiceStub },
//             ],
//         }).compileComponents();
//
//         fixture = TestBed.createComponent(NavbarComponent);
//         languageService = TestBed.inject(LanguageService);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
//
//     it('should switch theme', () => {
//         const spy = spyOn<any>(component, 'onSwitchTheme').and.callThrough();
//         const switchThemeButton = fixture.nativeElement.querySelector('#switch-theme-button') as HTMLButtonElement;
//
//         expect(component['darkTheme']).toBeFalse();
//         expect(switchThemeButton).toHaveClass('icon-sun');
//
//         switchThemeButton.click();
//         fixture.detectChanges();
//
//         expect(component['darkTheme']).toBeTrue();
//         expect(switchThemeButton).toHaveClass('icon-moon');
//         expect(spy).toHaveBeenCalled();
//     });
//
//     it('should change language', () => {
//         component['languageOptions'] = new Map<string, string>()
//             .set(Language.ENGLISH, 'English')
//             .set(Language.POLISH, 'Polish');
//
//         const selectOptionSpy = spyOn<any>(component, 'onSelectOption').and.callThrough();
//         const setLanguageSpy = spyOn(languageService, 'setLanguage').and.callThrough();
//         const changeLanguageButton = fixture.nativeElement
//             .querySelector('#change-language-button') as HTMLButtonElement;
//
//         changeLanguageButton.click();
//         component['onSelectOption']({ key: Language.ENGLISH, value: 'English' });
//
//         expect(selectOptionSpy).toHaveBeenCalledWith({ key: Language.ENGLISH, value: 'English' });
//         expect(setLanguageSpy).toHaveBeenCalledOnceWith(Language.ENGLISH);
//     });
// });

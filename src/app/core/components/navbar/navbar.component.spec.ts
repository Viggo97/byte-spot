import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { Theme } from '../../services/theme/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';
import { NavbarComponent } from './navbar.component';

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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [{ provide: ThemeService, useClass: ThemeServiceStub }],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should switch theme', () => {
        const spy = spyOn(component, 'switchTheme').and.callThrough();
        const switchThemeButton = fixture.nativeElement.querySelector('#switch-theme-button') as HTMLButtonElement;

        expect(component.darkTheme).toBeFalse();
        expect(switchThemeButton).toHaveClass('icon-sun');

        switchThemeButton.click();
        fixture.detectChanges();

        expect(component.darkTheme).toBeTrue();
        expect(switchThemeButton).toHaveClass('icon-moon');
        expect(spy).toHaveBeenCalled();
    });
});

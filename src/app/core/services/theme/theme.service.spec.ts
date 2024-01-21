import { TestBed } from '@angular/core/testing';

import { Theme } from './theme.enum';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let themeService: ThemeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        themeService = TestBed.inject(ThemeService);
    });

    it('should use light theme as default', () => {
        let theme;
        themeService.theme$.subscribe((t) => {
            theme = t;
        });
        expect(theme).toEqual(Theme.LIGHT);
    });

    it('should set theme base on value from local storage', () => {

    });

    it('should skip incorrect value from local storage', () => {

    });

    it('should set theme base on preferred color scheme', () => {

    });

    it('should switch theme', () => {

    });
});

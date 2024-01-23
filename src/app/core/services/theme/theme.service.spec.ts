import { TestBed } from '@angular/core/testing';

import { Theme } from './theme.enum';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let themeService: ThemeService;

    const getMediaQueryListMock = (matches: boolean): MediaQueryList => ({
        matches,
        media: '(prefers-color-scheme: dark)',
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        onchange: () => {},
        dispatchEvent: () => false,
    });

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({});
    });

    it('should set light theme as default', () => {
        spyOn(window, 'matchMedia').and.returnValue(getMediaQueryListMock(false));
        themeService = TestBed.inject(ThemeService);
        let theme: Theme | undefined;
        themeService.theme$.subscribe((t) => {
            theme = t;
        });

        expect(theme).toBe(Theme.LIGHT);
    });

    it('should set dark theme based on preferred scheme', () => {
        spyOn(window, 'matchMedia').and.returnValue(getMediaQueryListMock(true));
        themeService = TestBed.inject(ThemeService);
        let theme: Theme | undefined;
        themeService.theme$.subscribe((t) => {
            theme = t;
        });

        expect(theme).toBe(Theme.DARK);
    });

    it('should set theme base on value from local storage', () => {
        spyOn(localStorage, 'getItem').and.returnValue('light');
        themeService = TestBed.inject(ThemeService);
        let theme: Theme | undefined;
        themeService.theme$.subscribe((t) => {
            theme = t;
        });

        expect(theme).toBe(Theme.LIGHT);
    });

    it('should skip incorrect value from local storage', () => {
        spyOn(window, 'matchMedia').and.returnValue(getMediaQueryListMock(false));
        spyOn(localStorage, 'getItem').and.returnValue('incorrect value');
        themeService = TestBed.inject(ThemeService);
        let theme: Theme | undefined;
        themeService.theme$.subscribe((t) => {
            theme = t;
        });

        expect(theme).toBe(Theme.LIGHT);
    });
});

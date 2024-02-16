import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DropdownContainerComponent } from './dropdown-container.component';

const options = new Map()
    .set('opt1', 'Option 1')
    .set('opt2', 'Option 2')
    .set('opt3', 'Option 3')
    .set('opt4', 'Option 4')
    .set('opt5', 'Option 5');

describe('DropdownContainerComponent', () => {
    let component: DropdownContainerComponent;
    let fixture: ComponentFixture<DropdownContainerComponent>;

    const dispatchEvent = (element: Window | Element, event: KeyboardEvent, times: number = 7) => {
        for (let i = 0; i < times; i += 1) {
            element.dispatchEvent(event);
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DropdownContainerComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(DropdownContainerComponent);
        component = fixture.componentInstance;
        component.options = options;
        component.tabIndex = 1000;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render items in container', () => {
        const container = fixture.debugElement.query(By.css('.dropdown-container'));
        const items = fixture.debugElement.queryAll(By.css('.dropdown-item'));

        expect(container).toBeTruthy();
        expect(items).toHaveSize(5);
        expect(items[0].nativeElement.getAttribute('tabindex')).toEqual('1000');
    });

    it('should set custom number of visible options', () => {
        component.numberOfVisibleOptions = 3;
        const container = fixture.debugElement.query(By.css('.dropdown-container'));

        expect(container.nativeElement.style.maxHeight).toEqual('170px');
    });

    it('should navigate through items by arrows and tab', () => {
        const arrowDownEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
        const arrowUpEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });
        const tabEvent = new KeyboardEvent('keydown', { code: 'Tab' });
        const tabShiftEvent = new KeyboardEvent('keydown', { code: 'Tab', shiftKey: true });
        const firstItem = fixture.debugElement.queryAll(By.css('.dropdown-item'))[0].nativeElement;
        const lastItem = fixture.debugElement.queryAll(By.css('.dropdown-item'))[4].nativeElement;
        const firstItemFocusSpy = spyOn(firstItem, 'focus').and.callThrough();
        const lastItemFocusSpy = spyOn(lastItem, 'focus').and.callThrough();

        dispatchEvent(window, arrowDownEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(1);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(1);
        expect(lastItem).toEqual(document.activeElement);

        dispatchEvent(window, arrowUpEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(1);
        expect(firstItem).toEqual(document.activeElement);

        dispatchEvent(window, tabEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(lastItem).toEqual(document.activeElement);

        dispatchEvent(window, tabShiftEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(3);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(firstItem).toEqual(document.activeElement);
    });

    it('should select item by click', () => {
        const items = fixture.debugElement.queryAll(By.css('.dropdown-item'));
        const onSelectItemSpy = spyOn(component, 'onSelectItem').and.callThrough();
        const selectItemSpy = spyOn(component.selectOption, 'emit').and.callThrough();

        items[0].nativeElement.click();

        expect(onSelectItemSpy).toHaveBeenCalledTimes(1);
        expect(selectItemSpy).toHaveBeenCalledTimes(1);
    });

    it('should select item by keyboard', () => {
        const arrowDownEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
        const enterEvent = new KeyboardEvent('keyup', { code: 'Enter' });
        const spaceEvent = new KeyboardEvent('keyup', { code: 'Space' });
        const selectItemSpy = spyOn(component.selectOption, 'emit').and.callThrough();

        dispatchEvent(window, arrowDownEvent, 1);
        dispatchEvent(fixture.nativeElement, enterEvent, 1);

        expect(selectItemSpy).toHaveBeenCalledTimes(1);

        dispatchEvent(window, arrowDownEvent, 1);
        dispatchEvent(fixture.nativeElement, spaceEvent, 1);

        expect(selectItemSpy).toHaveBeenCalledTimes(2);
    });

    it('should NOT trigger any action by other keys', () => {
        const keydownEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
        const keyupEvent = new KeyboardEvent('keyup', { code: 'Delete' });
        const selectItemSpy = spyOn(component.selectOption, 'emit').and.callThrough();

        dispatchEvent(window, keydownEvent, 1);
        dispatchEvent(fixture.nativeElement, keyupEvent, 1);

        expect(selectItemSpy).not.toHaveBeenCalled();
    });

    it('should set reset tabindex', () => {
        const keydownEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
        const clickEvent = new MouseEvent('click');
        const firstItem = fixture.debugElement.queryAll(By.css('.dropdown-item'))[0].nativeElement;
        const thirdItem = fixture.debugElement.queryAll(By.css('.dropdown-item'))[2].nativeElement;

        dispatchEvent(window, keydownEvent, 3);

        expect(document.activeElement).toEqual(thirdItem);

        fixture.componentInstance.onClick(clickEvent);
        dispatchEvent(window, keydownEvent, 1);

        expect(document.activeElement).toEqual(firstItem);
    });

    it('should navigate through items starting from end', () => {
        const keyupEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });
        const lastItem = fixture.debugElement.queryAll(By.css('.dropdown-item'))[4].nativeElement;

        dispatchEvent(window, keyupEvent, 1);

        expect(document.activeElement).toEqual(lastItem);
    });
});

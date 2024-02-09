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

    const dispatchEvent = (event: KeyboardEvent | FocusEvent, times: number = 7) => {
        for (let i = 0; i < times; i += 1) {
            fixture.nativeElement.dispatchEvent(event);
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

        dispatchEvent(arrowDownEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(1);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(1);
        expect(lastItem).toEqual(document.activeElement);

        dispatchEvent(arrowUpEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(1);
        expect(firstItem).toEqual(document.activeElement);

        dispatchEvent(tabEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(lastItem).toEqual(document.activeElement);

        dispatchEvent(tabShiftEvent);

        expect(firstItemFocusSpy).toHaveBeenCalledTimes(3);
        expect(lastItemFocusSpy).toHaveBeenCalledTimes(2);
        expect(firstItem).toEqual(document.activeElement);
    });

    it('should select item by click', () => {
        const items = fixture.debugElement.queryAll(By.css('.dropdown-item'));
        const onSelectItemSpy = spyOn(component, 'onSelectItem').and.callThrough();
        const selectItemSpy = spyOn(component.selectItem, 'emit').and.callThrough();

        items[0].nativeElement.click();

        expect(onSelectItemSpy).toHaveBeenCalled();
        expect(selectItemSpy).toHaveBeenCalled();
    });

    it('should select item by keyboard', () => {
        const arrowDownEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
        const enterEvent = new KeyboardEvent('keyup', { code: 'Enter' });
        const spaceEvent = new KeyboardEvent('keyup', { code: 'Space' });
        const selectItemSpy = spyOn(component.selectItem, 'emit').and.callThrough();

        dispatchEvent(arrowDownEvent, 1);
        dispatchEvent(enterEvent, 1);

        expect(selectItemSpy).toHaveBeenCalledTimes(1);

        dispatchEvent(arrowDownEvent, 1);
        dispatchEvent(spaceEvent, 1);

        expect(selectItemSpy).toHaveBeenCalledTimes(2);
    });

    it('should NOT trigger any action by other keys', () => {
        const keydownEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
        const keyupEvent = new KeyboardEvent('keyup', { code: 'Delete' });
        const selectItemSpy = spyOn(component.selectItem, 'emit').and.callThrough();

        dispatchEvent(keydownEvent, 1);
        dispatchEvent(keyupEvent, 1);

        expect(selectItemSpy).not.toHaveBeenCalled();
    });

    it('should set and handle focus in and out', () => {
        const onFocusInSpy = spyOn(component, 'onFocusIn').and.callThrough();
        const onFocusOutSpy = spyOn(component, 'onFocusOut').and.callThrough();
        const focusinEvent = new FocusEvent('focusin');
        const focusoutEvent = new FocusEvent('focusout');

        dispatchEvent(focusinEvent);
        dispatchEvent(focusoutEvent);

        expect(onFocusInSpy).toHaveBeenCalled();
        expect(onFocusOutSpy).toHaveBeenCalled();
    });
});

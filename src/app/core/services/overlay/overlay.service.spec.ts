import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EdgeX, EdgeY } from '../../models/relative-position-edge';
import { OverlayService } from './overlay.service';

@Component({
    selector: 'bsa-mock-component',
    template: '<div id="mock-component">Mock Component, input value: {{ testInput }}</div>',
})
class MockComponent {
    @Input() testInput: string = '';
    @Output() testOutput = new EventEmitter<string>();
}

const setupEnvForRelativePositionTests = () => {
    // overwrite karma-jasmine default styles
    document.body.style.marginLeft = '0';
    document.body.style.marginRight = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';

    const relativeElement = document.createElement('div');
    relativeElement.style.width = '100px';
    relativeElement.style.height = '100px';
    relativeElement.style.position = 'absolute';
    relativeElement.style.top = '200px';
    relativeElement.style.left = '200px';
    relativeElement.style.backgroundColor = 'blue';
    document.body.appendChild(relativeElement);

    return relativeElement;
};

const setupOverlayContent = () => {
    const overlayContent = document.querySelector('.overlay-content') as HTMLDivElement;
    overlayContent.style.position = 'absolute';
    return overlayContent;
};

describe('OverlayService', () => {
    let service: OverlayService<MockComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MockComponent],
        });
        const overlayContainer = document.createElement('div');
        overlayContainer.classList.add('overlay-container');
        overlayContainer.style.position = 'fixed';
        overlayContainer.style.inset = '0px';
        document.body.appendChild(overlayContainer);
        service = TestBed.inject(OverlayService);
    });

    afterEach(() => {
        document.querySelector('.overlay-container')?.remove();
    });

    it('should create component in overlay without additional options', () => {
        service.show(MockComponent);
        const componentContent = document.getElementById('mock-component');
        const overlayContent = document.querySelector('.overlay-container');

        expect(componentContent).toBeTruthy();
        expect(overlayContent).toHaveClass('overlay-container-show');
    });

    it('should add backdrop background', () => {
        service.show(MockComponent);
        const backdrop = document.querySelector('.backdrop');

        expect(backdrop).toBeTruthy();
        expect(backdrop).toHaveClass('backdrop-background');
    });

    it('should NOT add backdrop background', () => {
        service.show(MockComponent, { backdrop: { background: false } });
        const backdrop = document.querySelector('.backdrop');

        expect(backdrop).toBeTruthy();
        expect(backdrop).not.toHaveClass('backdrop-background');
    });

    it('should add backdrop close action on click', () => {
        const spy = spyOn(service, 'close');
        service.show(MockComponent);
        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;

        backdrop.click();

        expect(backdrop).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });

    it('should NOT add backdrop close action on click', () => {
        const spy = spyOn(service, 'close');
        service.show(MockComponent, { backdrop: { closeOnBackdropClick: false } });
        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;

        backdrop.click();

        expect(backdrop).toBeTruthy();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should add backdrop close action on Escape', () => {
        const spy = spyOn(service, 'close');
        const escapeEvent = new KeyboardEvent('keyup', { code: 'Escape' });
        service.show(MockComponent);
        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;

        window.dispatchEvent(escapeEvent);

        expect(backdrop).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });

    it('should NOT add backdrop close action on Escape', () => {
        const spy = spyOn(service, 'close');
        const escapeEvent = new KeyboardEvent('keyup', { code: 'Escape' });
        service.show(MockComponent, { backdrop: { closeOnEscape: false } });
        const backdrop = document.querySelector('.backdrop') as HTMLDivElement;

        window.dispatchEvent(escapeEvent);

        expect(backdrop).toBeTruthy();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should set component position based on directPosition options', () => {
        service.show(MockComponent, { directPosition: { top: 10, left: 20 } });
        const overlayContent = document.querySelector('.overlay-content') as HTMLDivElement;
        expect(overlayContent.style.top).toBe('10px');
        expect(overlayContent.style.left).toBe('20px');
    });

    it('should set component position based on relativePosition default options', () => {
        const relativeElement = document.createElement('div');
        relativeElement.style.width = '100px';
        relativeElement.style.height = '100px';
        document.body.appendChild(relativeElement);

        service.show(MockComponent, { relativePosition: { relativeElement } });

        const overlayContent = document.querySelector('.overlay-content') as HTMLDivElement;
        overlayContent.style.position = 'absolute';
        const relativeElementTop = relativeElement.getBoundingClientRect().top;
        const relativeElementLeft = relativeElement.getBoundingClientRect().left;
        const overlayContentTop = overlayContent.getBoundingClientRect().top;
        const overlayContentLeft = overlayContent.getBoundingClientRect().left;

        expect(overlayContentTop - relativeElementTop).toEqual(0);
        expect(overlayContentLeft - relativeElementLeft).toEqual(0);

        service.close();
        relativeElement.remove();
    });

    it('should set component position based on relativePosition options with custom offsets', () => {
        const relativeElement = document.createElement('div');
        relativeElement.style.width = '100px';
        relativeElement.style.height = '100px';
        document.body.appendChild(relativeElement);

        service.show(MockComponent, { relativePosition: { relativeElement, offsetY: 10, offsetX: 20 } });

        const overlayContent = document.querySelector('.overlay-content') as HTMLDivElement;
        overlayContent.style.position = 'absolute';
        let relativeElementTop = relativeElement.getBoundingClientRect().top;
        let relativeElementLeft = relativeElement.getBoundingClientRect().left;
        let overlayContentTop = overlayContent.getBoundingClientRect().top;
        let overlayContentLeft = overlayContent.getBoundingClientRect().left;

        expect(overlayContentTop - relativeElementTop).toEqual(10);
        expect(overlayContentLeft - relativeElementLeft).toEqual(20);

        window.dispatchEvent(new Event('resize'));

        relativeElementTop = relativeElement.getBoundingClientRect().top;
        relativeElementLeft = relativeElement.getBoundingClientRect().left;
        overlayContentTop = overlayContent.getBoundingClientRect().top;
        overlayContentLeft = overlayContent.getBoundingClientRect().left;

        expect(overlayContentTop - relativeElementTop).toEqual(10);
        expect(overlayContentLeft - relativeElementLeft).toEqual(20);

        service.close();
        relativeElement.remove();
    });

    it('should set component position based on relativePosition options with custom edges LL-TT', () => {
        const relativeElement = setupEnvForRelativePositionTests();

        service.show(MockComponent, {
            relativePosition: {
                relativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.LEFT,
                    contentEdge: EdgeX.LEFT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.TOP,
                    contentEdge: EdgeY.TOP,
                },
            },
        });

        const overlayContent = setupOverlayContent();
        const relativeElementTop = relativeElement.getBoundingClientRect().top;
        const relativeElementLeft = relativeElement.getBoundingClientRect().left;
        const overlayContentTop = overlayContent.getBoundingClientRect().top;
        const overlayContentLeft = overlayContent.getBoundingClientRect().left;

        expect(overlayContentTop - relativeElementTop).toEqual(0);
        expect(overlayContentLeft - relativeElementLeft).toEqual(0);

        service.close();
        relativeElement.remove();
    });

    it('should set component position based on relativePosition options with custom edges LR-TB', () => {
        const relativeElement = setupEnvForRelativePositionTests();

        service.show(MockComponent, {
            relativePosition: {
                relativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.LEFT,
                    contentEdge: EdgeX.RIGHT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.TOP,
                    contentEdge: EdgeY.BOTTOM,
                },
            },
        });

        const overlayContent = setupOverlayContent();
        const relativeElementTop = relativeElement.getBoundingClientRect().top;
        const relativeElementLeft = relativeElement.getBoundingClientRect().left;
        const overlayContentBottom = overlayContent.getBoundingClientRect().bottom;
        const overlayContentRight = overlayContent.getBoundingClientRect().right;

        expect(overlayContentBottom - relativeElementTop).toEqual(0);
        expect(overlayContentRight - relativeElementLeft).toEqual(0);

        service.close();
        relativeElement.remove();
    });

    it('should set component position based on relativePosition options with custom edges RL-BT', () => {
        const relativeElement = setupEnvForRelativePositionTests();

        service.show(MockComponent, {
            relativePosition: {
                relativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.RIGHT,
                    contentEdge: EdgeX.LEFT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.BOTTOM,
                    contentEdge: EdgeY.TOP,
                },
            },
        });

        const overlayContent = setupOverlayContent();
        const relativeElementRight = relativeElement.getBoundingClientRect().right;
        const relativeElementBottom = relativeElement.getBoundingClientRect().bottom;
        const overlayContentLeft = overlayContent.getBoundingClientRect().left;
        const overlayContentTop = overlayContent.getBoundingClientRect().top;

        expect(overlayContentTop - relativeElementBottom).toEqual(0);
        expect(overlayContentLeft - relativeElementRight).toEqual(0);

        service.close();
        relativeElement.remove();
    });

    it('should set component position based on relativePosition options with custom edges RR-BB', () => {
        const relativeElement = setupEnvForRelativePositionTests();

        service.show(MockComponent, {
            relativePosition: {
                relativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.RIGHT,
                    contentEdge: EdgeX.RIGHT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.BOTTOM,
                    contentEdge: EdgeY.BOTTOM,
                },
            },
        });

        const overlayContent = setupOverlayContent();
        const relativeElementBottom = relativeElement.getBoundingClientRect().bottom;
        const relativeElementRight = relativeElement.getBoundingClientRect().right;
        const overlayContentBottom = overlayContent.getBoundingClientRect().bottom;
        const overlayContentRight = overlayContent.getBoundingClientRect().right;

        expect(overlayContentBottom - relativeElementBottom).toEqual(0);
        expect(overlayContentRight - relativeElementRight).toEqual(0);

        service.close();
        relativeElement.remove();
    });

    it('should set component position based on default options (center)', () => {
        service.show(MockComponent);
        const overlayContent = document.querySelector('.overlay-content');
        expect(overlayContent).toHaveClass('overlay-content-center');
    });

    it('should prevent double call show method', () => {
        const componentRef1 = service.show(MockComponent);
        const componentRef2 = service.show(MockComponent);
        const overlayContainers = document.querySelectorAll('.overlay-container');
        expect(componentRef1).not.toBe(null);
        expect(componentRef2).toBe(null);
        expect(overlayContainers).toHaveSize(1);
    });

    it('should set input in component', () => {
        const componentRef = service.show(MockComponent, {
            componentInputs: [{ name: 'testInput', value: 'input value' }],
        });
        const componentContent = document.getElementById('mock-component') as HTMLDivElement;
        expect(componentRef?.instance.testInput).toBe('input value');
        expect(componentContent.innerText).toContain('input value');
    });

    it('should subscribe on output changes', () => {
        const componentRef = service.show(MockComponent);
        componentRef?.instance.testOutput.emit('output value');
        service.outputChange$.subscribe((value) => {
            expect(value.name).toEqual('testOutput');
            expect(value.value).toEqual('output value');
        });
    });

    it('should close overlay', () => {
        const spy = spyOn(service, 'close').and.callThrough();
        let counter = 0;

        service.show(MockComponent);
        service.onClose$.subscribe(() => {
            counter += 1;
        });
        service.close();
        expect(counter).toEqual(1);

        expect(spy).toHaveBeenCalled();
    });
});

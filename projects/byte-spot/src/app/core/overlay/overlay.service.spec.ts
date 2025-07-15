import {
    Component,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayService } from '@app/core/overlay/overlay.service';

@Component({
    selector: 'bsa-mock-component',
    template: '',
    standalone: false
})
class MockComponent {}

describe('OverlayService', () => {
    let service: OverlayService<MockComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MockComponent],
        });
        service = TestBed.inject(OverlayService<MockComponent>);
    });

    it('should show create and return component with overlay', () => {
        const spy = spyOn(service, 'show').and.callThrough();
        service.show(MockComponent);
        expect(spy).toHaveBeenCalled();
    });
});

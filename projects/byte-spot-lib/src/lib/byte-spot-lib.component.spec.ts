import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByteSpotLibComponent } from './byte-spot-lib.component';

describe('ByteSpotLibComponent', () => {
  let component: ByteSpotLibComponent;
  let fixture: ComponentFixture<ByteSpotLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByteSpotLibComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ByteSpotLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

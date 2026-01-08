import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AptitudeTestComponent } from './aptitude-test.component';

describe('AptitudeTestComponent', () => {
  let component: AptitudeTestComponent;
  let fixture: ComponentFixture<AptitudeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AptitudeTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AptitudeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

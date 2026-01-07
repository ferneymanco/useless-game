import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AptitudTest } from './aptitud-test';

describe('AptitudTest', () => {
  let component: AptitudTest;
  let fixture: ComponentFixture<AptitudTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AptitudTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AptitudTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

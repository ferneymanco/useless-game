import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularDashboardComponent } from './dashboard-regular';

describe('RegularDashboardComponent', () => {
  let component: RegularDashboardComponent;
  let fixture: ComponentFixture<RegularDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegularDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

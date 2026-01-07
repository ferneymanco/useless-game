import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRegular } from './dashboard-regular';

describe('DashboardRegular', () => {
  let component: DashboardRegular;
  let fixture: ComponentFixture<DashboardRegular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRegular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRegular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

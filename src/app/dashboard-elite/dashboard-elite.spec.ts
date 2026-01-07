import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardElite } from './dashboard-elite';

describe('DashboardElite', () => {
  let component: DashboardElite;
  let fixture: ComponentFixture<DashboardElite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardElite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardElite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

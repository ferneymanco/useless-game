import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteDashboardComponent } from './dashboard-elite';

describe('EliteDashboardComponent', () => {
  let component: EliteDashboardComponent;
  let fixture: ComponentFixture<EliteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

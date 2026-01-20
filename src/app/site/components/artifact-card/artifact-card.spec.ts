import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactCard } from './artifact-card';

describe('ArtifactCard', () => {
  let component: ArtifactCard;
  let fixture: ComponentFixture<ArtifactCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtifactCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

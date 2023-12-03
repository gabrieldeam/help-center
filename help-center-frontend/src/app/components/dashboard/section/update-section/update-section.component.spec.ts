import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSectionComponent } from './update-section.component';

describe('UpdateSectionComponent', () => {
  let component: UpdateSectionComponent;
  let fixture: ComponentFixture<UpdateSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSectionComponent]
    });
    fixture = TestBed.createComponent(UpdateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

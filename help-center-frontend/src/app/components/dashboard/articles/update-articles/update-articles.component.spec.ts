import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArticlesComponent } from './update-articles.component';

describe('UpdateArticlesComponent', () => {
  let component: UpdateArticlesComponent;
  let fixture: ComponentFixture<UpdateArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateArticlesComponent]
    });
    fixture = TestBed.createComponent(UpdateArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

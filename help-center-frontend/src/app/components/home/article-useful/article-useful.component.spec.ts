import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleUsefulComponent } from './article-useful.component';

describe('ArticleUsefulComponent', () => {
  let component: ArticleUsefulComponent;
  let fixture: ComponentFixture<ArticleUsefulComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleUsefulComponent]
    });
    fixture = TestBed.createComponent(ArticleUsefulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AllCategoriesPage } from './all-categories.page';

describe('AllCategoriesPage', () => {
  let component: AllCategoriesPage;
  let fixture: ComponentFixture<AllCategoriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

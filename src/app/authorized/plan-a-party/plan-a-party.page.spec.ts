import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PlanAPartyPage } from './plan-a-party.page';

describe('PlanAPartyPage', () => {
  let component: PlanAPartyPage;
  let fixture: ComponentFixture<PlanAPartyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlanAPartyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

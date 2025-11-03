import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickAddPage } from './quick-add.page';

describe('QuickAddPage', () => {
  let component: QuickAddPage;
  let fixture: ComponentFixture<QuickAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

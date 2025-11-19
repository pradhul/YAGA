import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiometricSetupPage } from './biometric-setup.page';

describe('BiometricSetupPage', () => {
  let component: BiometricSetupPage;
  let fixture: ComponentFixture<BiometricSetupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

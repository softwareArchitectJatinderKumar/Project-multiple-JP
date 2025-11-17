import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalUserLoginComponent } from './externalUser-login.component';

describe('ExternalUserLoginComponent', () => {
  let component: ExternalUserLoginComponent;
  let fixture: ComponentFixture<ExternalUserLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalUserLoginComponent]
    });
    fixture = TestBed.createComponent(ExternalUserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

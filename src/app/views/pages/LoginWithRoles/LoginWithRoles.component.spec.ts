import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithRolesComponent } from './LoginWithRoles.component';

describe('LoginWithRolesComponent', () => {
  let component: LoginWithRolesComponent;
  let fixture: ComponentFixture<LoginWithRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginWithRolesComponent]
    });
    fixture = TestBed.createComponent(LoginWithRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

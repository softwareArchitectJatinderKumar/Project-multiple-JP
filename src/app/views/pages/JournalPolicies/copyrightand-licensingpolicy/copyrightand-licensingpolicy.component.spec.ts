import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyrightandLicensingpolicyComponent } from './copyrightand-licensingpolicy.component';

describe('CopyrightandLicensingpolicyComponent', () => {
  let component: CopyrightandLicensingpolicyComponent;
  let fixture: ComponentFixture<CopyrightandLicensingpolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyrightandLicensingpolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyrightandLicensingpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

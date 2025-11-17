import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationChargePolicyComponent } from './publication-charge-policy.component';

describe('PublicationChargePolicyComponent', () => {
  let component: PublicationChargePolicyComponent;
  let fixture: ComponentFixture<PublicationChargePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationChargePolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationChargePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

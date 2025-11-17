import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagriasmPolicyComponent } from './plagriasm-policy.component';

describe('PlagriasmPolicyComponent', () => {
  let component: PlagriasmPolicyComponent;
  let fixture: ComponentFixture<PlagriasmPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlagriasmPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagriasmPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

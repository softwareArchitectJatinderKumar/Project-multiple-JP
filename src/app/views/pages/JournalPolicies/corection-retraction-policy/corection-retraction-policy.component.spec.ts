import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorectionRetractionPolicyComponent } from './corection-retraction-policy.component';

describe('CorectionRetractionPolicyComponent', () => {
  let component: CorectionRetractionPolicyComponent;
  let fixture: ComponentFixture<CorectionRetractionPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorectionRetractionPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorectionRetractionPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

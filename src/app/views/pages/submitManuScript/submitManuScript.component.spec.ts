import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitManuScriptComponent } from './SubmitManuScript.component';

describe('SubmitManuScriptComponent', () => {
  let component: SubmitManuScriptComponent;
  let fixture: ComponentFixture<SubmitManuScriptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitManuScriptComponent]
    });
    fixture = TestBed.createComponent(SubmitManuScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

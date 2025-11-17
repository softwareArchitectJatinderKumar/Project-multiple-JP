import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuScriptWorkflowComponent } from './manuscript-workflow.component';

describe('ManuScriptWorkflowComponent', () => {
  let component: ManuScriptWorkflowComponent;
  let fixture: ComponentFixture<ManuScriptWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuScriptWorkflowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuScriptWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManuScriptReportComponent } from './ManuScriptReport.component';

describe('ManuScriptReportComponent', () => {
  let component: ManuScriptReportComponent;
  let fixture: ComponentFixture<ManuScriptReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuScriptReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuScriptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

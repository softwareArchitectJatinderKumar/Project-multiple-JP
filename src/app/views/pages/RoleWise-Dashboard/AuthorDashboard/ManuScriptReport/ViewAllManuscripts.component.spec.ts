/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewAllManuscripts } from './ViewAllManuscripts.component';

describe('ViewAllManuscripts', () => {
  let component: ViewAllManuscripts;
  let fixture: ComponentFixture<ViewAllManuscripts>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllManuscripts ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllManuscripts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

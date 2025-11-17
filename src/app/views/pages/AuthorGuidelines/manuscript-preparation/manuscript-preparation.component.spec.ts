import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuScriptPreparationComponent } from './manuscript-preparation.component';

describe('ManuScriptPreparationComponent', () => {
  let component: ManuScriptPreparationComponent;
  let fixture: ComponentFixture<ManuScriptPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuScriptPreparationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuScriptPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

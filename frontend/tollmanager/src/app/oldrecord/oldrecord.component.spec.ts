import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldrecordComponent } from './oldrecord.component';

describe('OldrecordComponent', () => {
  let component: OldrecordComponent;
  let fixture: ComponentFixture<OldrecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldrecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

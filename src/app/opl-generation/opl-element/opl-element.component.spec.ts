import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OplElementComponent } from './opl-element.component';

describe('OplElementComponent', () => {
  let component: OplElementComponent;
  let fixture: ComponentFixture<OplElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OplElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OplElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

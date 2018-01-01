import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OplParagraphComponent } from './opl-paragraph.component';

describe('OplParagraphComponent', () => {
  let component: OplParagraphComponent;
  let fixture: ComponentFixture<OplParagraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OplParagraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OplParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

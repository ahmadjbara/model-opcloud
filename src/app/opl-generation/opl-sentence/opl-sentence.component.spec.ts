import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OplSentenceComponent } from './opl-sentence.component';

describe('OplSentenceComponent', () => {
  let component: OplSentenceComponent;
  let fixture: ComponentFixture<OplSentenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OplSentenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OplSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

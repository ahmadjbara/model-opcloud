import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeBarComponent } from './resize-bar.component';

describe('ResizeBarComponent', () => {
  let component: ResizeBarComponent;
  let fixture: ComponentFixture<ResizeBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

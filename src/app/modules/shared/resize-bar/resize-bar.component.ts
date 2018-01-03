import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'opcloud-resize-bar',
  template: `
    <div class="resize-bar" [ngClass]="direction" #resizeBar>
      <div class="resize-bar-control"></div>
    </div>
  `,
  styleUrls: ['./resize-bar.component.scss']
})
export class ResizeBarComponent implements OnInit {
  @Input() direction;
  resize$;

  constructor(@Inject(DOCUMENT) private document, private el: ElementRef) {
    this.setDragListener();
  }

  ngOnInit() {
  }

  setDragListener() {
    const nativeElement = this.el.nativeElement;
    const mousedown$ = Observable.fromEvent(nativeElement, 'mousedown');
    const mousemove$ = Observable.fromEvent(this.document, 'mousemove')
      .map((e: MouseEvent) => ({ y: e.movementY, x: e.movementX }))
      .filter(movement => movement.x !== 0 || movement.y !== 0);
    const mouseup$ = Observable.fromEvent(this.document, 'mouseup');

    this.resize$ = mousedown$.mergeMap((md: MouseEvent) => {
      return mousemove$.takeUntil(mouseup$);
    });
  }

}

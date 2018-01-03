import {
  AfterContentInit,
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

import { ResizeBarComponent } from './resize-bar.component';

const DIRECTIONS = [
  'top',
  'right',
  'bottom',
  'left'
];

/***
 * Adds a resize bar to an element in the specified direction(s).
 * Usage: pass a string / array / object of the wanted resize directions.
 * Available directions: top, right, bottom, left
 * Examples:
 * <div opcloudResizableNew="top right">...</div>
 * <div [opcloudResizableNew]="['top', 'right']">...</div>
 * <div [opcloudResizableNew]="{top: true, right: true}">...</div>
 */
@Directive({
  selector: '[opcloudResizeBar]'
})
export class ResizeBarDirective implements AfterContentInit, AfterViewInit, OnDestroy {
  @ViewChild('resizeBar') resizeBar: ElementRef;
  @HostBinding('style.height') heightPx;
  @HostBinding('style.width') widthPx;
  @HostBinding('style.top') topPx;
  @HostBinding('style.left') leftPx;

  resizeBarComponentRefs = {};
  _directions;
  dimensions = {
    height: null,
    width: null,
    top: null,
    left: null
  };
  subscriptions = [];

  // get the desired resize direction as an input, transform it into the _directions object
  @Input()
  set opcloudResizeBar(directions) {
    if (!(directions instanceof Object || typeof directions === 'string')) {
      throw new Error(`Use of opcloudResizableNew directive is wrong.
      Please pass either an array of strings or a string of directions separated by space.`);
    }

    this._directions = DIRECTIONS.reduce((acc, val) => {
      return { ...acc, [val]: (directions instanceof Object ? directions.val : directions.indexOf(val) > -1) };
    }, {});
  }

  setDimension(name, val) {
    this.dimensions[name] += val;
    this[name + 'Px'] = this.dimensions[name] + 'px';
  }

  constructor(
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef) {
  }

  ngAfterContentInit() {
    this.dimensions.height = this.el.nativeElement.clientHeight;
    this.dimensions.width = this.el.nativeElement.clientWidth;
    this.dimensions.top = this.el.nativeElement.offsetTop;
    this.dimensions.left = this.el.nativeElement.offsetLeft;
  }

  ngAfterViewInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ResizeBarComponent);

    DIRECTIONS.forEach(direction => {
      if (this._directions[direction]) {
        const resizeBarComponent = this.viewContainerRef.createComponent(componentFactory);
        resizeBarComponent.instance.direction = direction;
        this.el.nativeElement.appendChild(resizeBarComponent.location.nativeElement);
        // append the created component as the host's child
        this.resizeBarComponentRefs[direction] = resizeBarComponent;

        this.subscriptions.push(
          resizeBarComponent.instance.resize$.subscribe(this.getNewSize(direction).bind(this))
        );
      }

    });
  }

  getNewSize(direction) {
    switch (direction) {
      case 'top':
        return (movement) => {
          this.setDimension('top', movement.y);
          this.setDimension('height', -movement.y);
        };
      case 'right':
        return (movement) => {
          this.setDimension('width', movement.x);
        };
      case 'bottom':
        return (movement) => {
          this.setDimension('height', movement.y);
        };
      case 'left':
        return (movement) => {
          this.setDimension('width', -movement.x);
          this.setDimension('left', movement.x);
        };
      default:
        return (movement) => {
          console.error('Resizable directive: unknown direction:', direction, movement);
        };
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

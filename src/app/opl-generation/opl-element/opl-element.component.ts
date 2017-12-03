import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'opcloud-opl-element',
  template: `
    <span [ngClass]="entityType" (click)="edit=true" *ngIf="!edit">
      {{entityName}}
    </span>
    <input >
  `,
  styleUrls: ['./opl-element.component.scss']
})
export class OplElementComponent implements OnInit {
  @Input() entityName;
  @Input() entityType;
  constructor() { }


  ngOnInit() {
  }
}

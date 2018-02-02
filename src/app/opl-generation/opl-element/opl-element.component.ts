import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'opcloud-opl-element',
  template: `
    <span [className]="entityType"  >
      {{entityName}}
    </span>
  `,
  styleUrls: ['./opl-element.component.scss']
})
export class OplElementComponent implements OnInit {
  @Input() cell;
  entityType;
  entityName;
  constructor() {
    this.entityType = this.cell.attributes.type;
    this.entityName = this.cell.attributes.attrs.text.text;
  }


  ngOnInit() {
  }
}

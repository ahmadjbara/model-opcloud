import { Component, EventEmitter, HostListener, Inject } from '@angular/core';
import {linkDrawing} from "../../configuration/elementsFunctionality/linkDrawing";
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import {GraphService} from '../../rappid-components/services/graph.service';
import {OpmObject} from "../../models/DrawnPart/OpmObject";
import {OpmState} from "../../models/DrawnPart/OpmState";

const joint = require('rappid');
@Component({
  selector: 'opcloud-choose-link-dialog',
  templateUrl: './Dialog.component.html',
  styleUrls: ['./Dialog.component.css']
})
export class DialogComponent {
  // resize
  x: number;
  y: number;
  px: number;
  py: number;
  width: number;
  height: number;
  width_min: number;
  height_min: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: Function;
  close = new EventEmitter();
  public newLink: any;
  public linkSource: any;
  public linkTarget: any;
  public opmLinks: Array<any>;
  private selected: any;
  listExpanded = false;
  show = true;
  noshow = false;
  // links arrays
  public Structural_Links: Array<any> = [];
  public Agent_Links: Array<any> = [];
  public Instrument_Links: Array<any> = [];
  public Effect_links: Array<any> = [];
  public Consumption_links: Array<any> = [];
  public Result_Link: Array<any> = [];
  public Exception_links: Array<any> = [];
  public Invocation_links: Array<any> = [];
  public Relation_Links: Array<any> = [];
  public In_out_Link_Pair:Array<any> = [];
  Graph = null;
  graph = null;



  constructor(
    @Inject(MD_DIALOG_DATA) private data: any,
    public dialogRef: MdDialogRef<DialogComponent>,private graphService:GraphService) {
    this.Graph = graphService.getGraph();
    this.graph = this.Graph;
    this.x = 400;
    this.y = 100;
    this.px = 0;
    this.py = 0;
    this.width = 455;
    this.height = 420;
    this.width_min = 455;
    this.height_min = 420;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 150000;

    this.newLink = data.newLink;
    this.linkSource = data.linkSource;
    this.linkTarget = data.linkTarget;
    this.opmLinks = data.opmLinks;
    this.Structural_Links = data.Structural_Links;
    this.Agent_Links = data.Agent_Links;
    this.Instrument_Links = data.Instrument_Links;
    this.Effect_links = data.Effect_links;
    this.Consumption_links = data.Consumption_links;
    this.Result_Link = data.Result_Link;
    this.Exception_links = data.Exception_links;
    this.Invocation_links = data.Invocation_links;
    this.Relation_Links = data.Relation_Links;
    this.In_out_Link_Pair = data.In_out_Link_Pair;


  }

  onClickedExit(link) {
    this.selected = link;
    this.newLink.attributes.name = this.selected.name;
    linkDrawing.drawLink(this.newLink, this.selected.name);
    this.newLink.attributes.opl = this.selected.opl;
    this.close.emit(this.selected);
    this.dialogRef.close(this.selected);
  }


  // use for colors
  get_style(data) {

    switch (data) {
      case 'opm.Object':
        return '#006400';

      case 'opm.Process':
        return '#00008B';
      case 'opm.State':
        return '#808000';
    }
  }

  // check link array size
  check_empty(links_set) {
    if (links_set.length === 0) {
      return this.noshow;
    } else {
      return this.show;
    }
  }

  IsPhysicalObject(element){
    if(element instanceof OpmObject){
    return element.attributes.attrs.rect.filter.args.dx != 0;}
    if(element instanceof OpmState){
     return this.graph.getCell(element.attributes.father).attributes.attrs.rect.filter.args.dx != 0;
    }
  }

  replacename(linkname) {
    let serv = linkname;
    if (typeof linkname !== 'undefined') {
      for (let ch of serv) {
        if (serv.indexOf('_') >= 0) {
          serv = linkname.replace(/_/g, ' ');
        } else if (serv.indexOf('-') >= 0) {
          serv = linkname.replace(/-/g, ' ');
        }
      }
    }
    return serv;
  }

  // Close Button
  DefaultExit(link) {
    this.close.emit('event');
    link.remove();
    this.dialogRef.close();
  }

  area() {
    return this.width * this.height;
  }

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }
    const offsetX = event.clientX - this.px;
    const offsetY = event.clientY - this.py;
    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  topLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.y += offsetY;
    this.width -= offsetX;
    this.height -= offsetY;
  }

  topRightResize(offsetX: number, offsetY: number) {
    this.y += offsetY;
    this.width += offsetX;
    this.height -= offsetY;
  }

  bottomLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.width -= offsetX;
    this.height += offsetY;
  }

  bottomRightResize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    this.height += offsetY;
  }

  onCornerClick(event: MouseEvent, resizer?: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    const offsetX = event.clientX - this.px;
    const offsetY = event.clientY - this.py;

    const lastX = this.x;
    const lastY = this.y;
    const pWidth = this.width;
    const pHeight = this.height;

    this.resizer(offsetX, offsetY);
    if (this.width < this.width_min || this.height < this.height_min) {
      this.x = lastX;
      this.y = lastY;
      this.width = pWidth;
      this.height = pHeight;
    }
    this.px = event.clientX;
    this.py = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }

  ShowAlret(){
    return this.noshow;
  }

}

function createCode(linkType, source, target) {
  if (linkType === 'Aggregation-Participation') {
    console.log('class ' + source + '{');
    console.log('    ' + target + ': number;');
    console.log('}');
  }
}

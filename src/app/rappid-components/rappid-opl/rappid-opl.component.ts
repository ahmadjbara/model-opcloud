import { Component, OnInit, ViewChild, ViewContainerRef,ComponentFactoryResolver,ComponentRef,Input } from '@angular/core';
import { linkTypeSelection} from '../../configuration/elementsFunctionality/linkTypeSelection';
import { oplFunctions} from "../../opl-generation/opl-functions";

// popup imports
import {DialogComponent} from "../../dialogs/choose-link-dialog/Dialog.component";
//import {DialogDirective} from "../../dialogs/choose-link-dialog/DialogDirective.directive";
import {OplDialogComponent} from "../../dialogs/opl-dialog/opl-dialog.component";


@Component({
  selector: 'opcloud-rappid-opl',
  template: `
    <div class="opl-container">
       <ng-container *ngFor="let cell of graph.getCells().reverse()">
          <p *ngIf = "cell.attributes.opl" 
            [innerHTML]="cell.attributes.opl" 
            (mouseover)="highlightCell(cell)"
            (mouseleave)="unhighlightCell(cell)">
          </p><br *ngIf = "cell.attributes.opl">
      </ng-container> 
    </div>
  `,
  styleUrls: ['./rappid-opl.component.css']
})
export class RappidOplComponent implements OnInit {
  @Input() graph;
  @Input() paper;

  constructor() {
  }

  ngOnInit() {
    this.GenerateOPL();
    this.HoverOnCells;
    this.test();
  }

  test(){
    this.graph.on('add',(cell)=>{
      console.log(cell);
    });
  }

  GenerateOPL() {
      this.graph.on('add', (cell) => {
        if (cell.attributes.type === 'opm.Object') {
          this.updateObjectOPL(cell);
        }

        if (cell.attributes.type === 'opm.Process') {
          this.updateProcessOPL(cell);
        }

        if (cell.attributes.type === 'opm.State') {
          this.updateStateOPL(cell);
        }
        if (cell.attributes.type === 'opm.Link') {
          this.updateLinkOPL(cell);
        }
      });


      this.graph.on('change', (cell) => {
        if (cell.attributes.type === 'opm.State') {
          this.updateStateOPL(cell);
        }

        if (cell.attributes.type === 'opm.Object') {
          this.updateObjectOPL(cell);
        }

        if (cell.attributes.type === 'opm.Process') {
          this.updateProcessOPL(cell);
        }

        if (cell.attributes.type != 'opm.Link') {
          var pt;
          var outboundLinks = this.graph.getConnectedLinks(cell, {outbound: true});
          for (pt in outboundLinks) {
            if(outboundLinks[pt].attributes.type == 'opm.Link')
              this.updateLinkOPL(outboundLinks[pt]);
          }
          var inboundLinks = this.graph.getConnectedLinks(cell, {inbound: true});
          for (pt in inboundLinks) {
            if(inboundLinks[pt].attributes.type == 'opm.Link')
              this.updateLinkOPL(inboundLinks[pt]);
          }
        }

        if (cell.attributes.type === 'opm.Link' && cell.attributes.opl != null) {
          this.updateLinkOPL(cell);
        }
      });
  };

  HoverOnCells(){
    this.paper.on('link:mouseenter',function(cellView,evt){
    },this);
  }

  //Function getElementEssence(cell) receives a cell from graph and gets its essence ('Physica' or 'Informatical').
  getElementEssence(cell){
    if(cell.attributes.type==='opm.Object') var essence=cell.attributes.attrs.rect.filter.args;
    if(cell.attributes.type==='opm.Process') var essence=cell.attributes.attrs.ellipse.filter.args;
    if(essence.dx>0) return 'physical';
    if(essence.dx==0) return 'informatical';
  }

  //Function getElementAffiliation(cell) receives a cell and gets its affliation ('Environmental' or 'Informatical').
  getElementAffiliation(cell){

    if(cell.attributes.type==='opm.Object'){
      if(cell.attributes.attrs.rect["stroke-dasharray"]== '10,5') return 'environmental';
      else return 'systemic';
    }
    if(cell.attributes.type==='opm.Process'){
      if(cell.attributes.attrs.ellipse["stroke-dasharray"]== '10,5') return 'environmental';
      else return 'systemic';
    }

  }

  //update OPL for a link when link is added or changed
  updateLinkOPL(cell){

    var src=cell.getSourceElement();
    var tgt=cell.getTargetElement();
    if(src && tgt){
        //cell.attributes.opl=linkTypeSelection.generateOPL(src,tgt,cell.attributes.name);
        cell.attributes.opl = oplFunctions.generateLinkOpl(cell, cell.attributes.name);
    }
  }
  //update OPL for an Object when object is added or changed
  updateObjectOPL(cell){
    var essence=this.getElementEssence(cell);
    var affiliation=this.getElementAffiliation(cell);
    var objectName=cell.attributes.attrs.text.text;

    cell.attributes.opl=`<b class="object">${objectName}</b> is <i>${affiliation}</i> and <i>${essence}</i><b>.</b>`;

  }
  //update OPL for a Process when process is added or changed
  updateProcessOPL(cell){
    var essence=this.getElementEssence(cell);
    var affiliation=this.getElementAffiliation(cell);
    var processName=cell.attributes.attrs.text.text;

    cell.attributes.opl=`<b class="process">${processName}</b> is <i>${affiliation}</i> and <i>${essence}</i><b>.</b>`;

  }
  updateStateOPL(cell) {
    const parent = cell.getParent();
    if ( !parent) {return; }
    const objectName = parent.attributes.attrs.text.text;
    if (parent.getEmbeddedCells()) {
      const states = parent.getEmbeddedCells();
      let stateOpl = `<b class="object">${objectName}</b> can be`;
      if (states.length === 1) {
        stateOpl = `<b class="object">${objectName}</b> is <b class="state">${states[0].attributes.attrs.text.text}</b><b>.</b>`;
      }else {
        let i = 0;
        for (; i < states.length - 2 ; i++) {
          stateOpl = stateOpl + ` <b class="state">${states[i].attributes.attrs.text.text}</b><b>,</b>`;
        }
        stateOpl = stateOpl + ` <b class="state">${states[i].attributes.attrs.text.text}</b> or <b class="state">${states[i+1].attributes.attrs.text.text}</b><b>.</b>`;
      }
     parent.getEmbeddedCells()[0].attributes.opl = stateOpl;
    }
  }

  highlightObject(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('rect/fill','#FFA500');

  }
  unhighlightObject(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('rect/fill','white')

  }

  highlightProcess(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('ellipse/fill','#FFA500')
  }

  unhighlightProcess(cell){
    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('ellipse/fill','white')
  }

  highlightLink(cell){
    const linkType = cell.attributes.name;
    let source= cell.getSourceElement();
    const target= cell.getTargetElement();
    if ([ 'Aggregation-Participation', 'Generalization-Specialization', 'Classification-Instantiation',
        'Exhibition-Characterization'].indexOf(linkType) > -1) {
      source = cell.getSource();
      const cellView = this.paper.findViewByModel(cell.getMainUpperLink());
      cellView.model.attr('.connection/stroke','#FFA500');
    }
    if(source.attributes.type==='opm.Object') this.highlightObject(source);
    else if(source.attributes.type==='opm.Process') this.highlightProcess(source);
    else if(source.attributes.type==='opm.State') this.highlightSingleState(source);
    if(target.attributes.type==='opm.Object') this.highlightObject(target);
    else if(target.attributes.type==='opm.Process') this.highlightProcess(target);
    else if(target.attributes.type==='opm.State') this.highlightSingleState(target);

    var cellView = this.paper.findViewByModel(cell);
    cellView.model.attr('.connection/stroke','#FFA500');
  }
  unhighlightLink(cell){
    const linkType = cell.attributes.name;
    let source= cell.getSourceElement();
    const target= cell.getTargetElement();
    if ([ 'Aggregation-Participation', 'Generalization-Specialization', 'Classification-Instantiation',
        'Exhibition-Characterization'].indexOf(linkType) > -1) {
      source = cell.getSource();
      const cellView = this.paper.findViewByModel(cell.getMainUpperLink());
      cellView.model.removeAttr('.connection/stroke');
    }
    if(source.attributes.type==='opm.Object') this.unhighlightObject(source);
    else if(source.attributes.type==='opm.Process') this.unhighlightProcess(source);
    else if(source.attributes.type==='opm.State') this.unhighlightSingleState(source);
    if(target.attributes.type==='opm.Object') this.unhighlightObject(target);
    else if(target.attributes.type==='opm.Process') this.unhighlightProcess(target);
    else if(target.attributes.type==='opm.State') this.unhighlightSingleState(target);

    var cellView = this.paper.findViewByModel(cell);
    cellView.model.removeAttr('.connection/stroke');
  }
  highlightStates(cell){
    const parent = cell.getParent();
    if (parent.getEmbeddedCells()) {
      const states = parent.getEmbeddedCells();
      for (const state of states) {
        this.highlightSingleState(state);
      }
    }
  }
  unhighlightStates(cell){
    const parent = cell.getParent();
    if (parent.getEmbeddedCells()) {
      const states = parent.getEmbeddedCells();
      for (const state of states) {
        this.unhighlightSingleState(state);
      }
    }
  }
  highlightSingleState(state){
    const cellView = this.paper.findViewByModel(state);
    cellView.model.attr('.inner/fill','#FFA500');
    cellView.model.attr('.outer/fill','#FFA500');
  }
  unhighlightSingleState(state){
    const cellView = this.paper.findViewByModel(state);
    cellView.model.attr('.inner/fill','white');
    cellView.model.attr('.outer/fill','white');
  }


  highlightCell(cell) {
    switch(cell.attributes.type) {
      case 'opm.Object':
        this.highlightObject(cell);
        break;
      case 'opm.Process': this.highlightProcess(cell);
        break;
      case 'opm.Link': this.highlightLink(cell);
        break;
      case 'opm.State': this.highlightStates(cell);
        break;
    }

  }

  unhighlightCell(cell){
    switch(cell.attributes.type) {
      case 'opm.Object': this.unhighlightObject(cell);
        break;
      case 'opm.Process': this.unhighlightProcess(cell);
        break;
      case 'opm.Link': this.unhighlightLink(cell);
        break;
      case 'opm.State': this.unhighlightStates(cell);
        break;
    }

  }

}

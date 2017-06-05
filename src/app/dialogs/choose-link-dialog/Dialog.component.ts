import {Component, EventEmitter, Input, ViewChild} from '@angular/core';


@Component({
  selector: 'dlg',
  templateUrl: './Dialog.component.html',
  styleUrls: ['./Dialog.component.css']
})
export class DialogComponent {

  close = new EventEmitter();
  public newLink: any;
  public linkSource: any;
  public linkTarget: any;
  public opmLinks : Array<any>;
  private selected: any;

  onClickedExit(link) {
    this.close.emit('event');
    this.selected = link;
    this.newLink.attributes.name = this.selected.name;
    console.log('link: ', link);
    console.log('linkSource: ', this.linkSource.attributes.attrs.text.text);
    console.log('linkTarget: ', this.linkTarget.attributes.attrs.text.text);
    createCode(link.name, this.linkSource.attributes.attrs.text.text, this.linkTarget.attributes.attrs.text.text);
  }
  select(link) {
    this.selected = link;

  }
  constructor(){
  }
}

function createCode(linkType, source, target){
  if(linkType  == 'Aggregation-Participation'){
    console.log('class ' + source + '{');
    console.log('    ' + target + ': number;');
    console.log('}');
  }
}

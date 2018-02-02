
/**
 * Created by ta2er on 2017-08-17.
 */

import {
  Component, EventEmitter, OnInit, Optional,
  ComponentFactoryResolver, ViewContainerRef,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import {MdDialogRef} from '@angular/material';
import {GraphService} from "../../rappid-components/services/graph.service";
import {InitRappidService} from "../../rappid-components/services/init-rappid.service";
import { NgProgress } from 'ngx-progressbar';
import * as FileSaver from "file-saver";
const parseString = require('xml2js').parseString;


@Component({
  selector: 'Upload_File',
  templateUrl:'FileUploader.html',
  styleUrls:['FileUploader.scss']
})

export class UploadFile implements OnInit {


  uploader: FileUploader = new FileUploader({});//Empty options to avoid having a target URL
  reader: FileReader = new FileReader();
  XML: XMLDocument;
  onAdd = new EventEmitter();
  importOPX: boolean = true;
  private OPX_JSON: any;
  SpinnerComponentRef;
  SpinnerComponentFactory;
  imported = false;
  log = '';
   now = new Date();

  constructor(@Optional() public dialogRef: MdDialogRef<FileUploader>, public ngProgress: NgProgress,
              private graphService: GraphService,
              private initRappidService: InitRappidService,
              private componentFactoryResolver?: ComponentFactoryResolver,
              private viewContainer?: ViewContainerRef) {


  }

  ngOnInit(): void {
    let That = this;
    this.reader.onload = (ev: any) => {
      this.XML = ev.target.result;

      parseString(this.XML, function (err, result) {
        That.OPX_JSON = result;
        console.log(That.OPX_JSON);

      });

    };
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      this.reader.readAsText(fileItem._file);

    };
  }

 /* spinner() {
    this.SpinnerComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ProgressSpinner);
    this.SpinnerComponentRef = this.viewContainer.createComponent(this.SpinnerComponentFactory);


  }*/

  public async Import() {

    let promise = new Promise<any>((resolve, reject) => {
      this.ngProgress.start();
      setTimeout(() => {resolve({})}, 3000);
    });
    promise.then(() => {
      this.log = JSON.stringify(this.graphService.importOpxGraph(this.OPX_JSON, this.initRappidService).Log,null,' ');
      this.ngProgress.done();
      this.imported  = true;
    });
}

 logFile(){
   FileSaver.saveAs(new Blob([this.log], {type: 'text/plain;charset=utf-8'}),
     'Log_'+this.now+'.txt');
   this.dialogRef.close();
 }

  onButtonClick() {
    this.onAdd.emit();
  }
}



/**
 * Created by ta2er on 2017-08-17.
 */

import {Component, EventEmitter, Optional} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { MdDialogRef } from '@angular/material';

const jsonfile = require('jsonfile');
const fs = require('fs') ;

@Component({
  selector: 'Upload_File',
  templateUrl:'FileUploader.html',
  styleUrls:['FileUploader.scss']
})
export class UploadFile {
  uploader: FileUploader = new FileUploader({});//Empty options to avoid having a target URL
  reader: FileReader = new FileReader();
  XML : XMLDocument;
  onAdd = new EventEmitter();
  loading: boolean = false;
  importOPX :boolean = true;
  ngOnInit() {
    this.reader.onload = (ev: any) => {
      this.XML = ev.target.result;

    };
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      this.reader.readAsText(fileItem._file);
    };
  }
  constructor(@Optional() public dialogRef: MdDialogRef<FileUploader>) {
  }

  Import(){
    this.loading = true;
    this.dialogRef.close(this.XML);
    this.loading = false;
  }

  onButtonClick() {
    this.onAdd.emit();
  }
}


import { Component, OnInit, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component ({
  selector: 'opcloud-clear-canvas-dialog',
  templateUrl: 'clear-canvas.html',
  styleUrls: ['clear-canvas.css']
})
export class ClearCanvasComponent implements OnInit {


  constructor(
    @Optional() public dialogRef: MdDialogRef<ClearCanvasComponent>) {
  }

  ngOnInit() {

  }


}

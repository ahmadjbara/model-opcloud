import { Component, OnInit, Optional } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component ({
  selector: 'opcloud-about-dialog',
  templateUrl: 'about.html',
  styleUrls: ['about.css']
})
export class AboutDialogComponent implements OnInit {


  constructor(
    @Optional() public dialogRef: MdDialogRef<AboutDialogComponent>) {
  }

  ngOnInit() {

  }


}

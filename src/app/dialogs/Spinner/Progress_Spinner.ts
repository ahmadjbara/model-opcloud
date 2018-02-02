import {Component, ElementRef, OnInit, Optional} from '@angular/core';
import {GraphService} from "../../rappid-components/services/graph.service";



/**
 * @title Basic progress-spinner
 */
@Component({
  selector: 'progress-spinner',
  templateUrl: 'Progress_Spinner.html',
  styleUrls:['Progress_Spinner.scss']
})
export class ProgressSpinner implements OnInit{
  element = this.elementRef.nativeElement;
  ngOnInit(): void {
  }
  constructor( private elementRef: ElementRef) {
  }


}

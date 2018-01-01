import { Component, OnInit } from '@angular/core';
import { OplService} from '../opl.service';
import { OplSentenceComponent } from '../opl-sentence/opl-sentence.component';

@Component({
  selector: 'opcloud-opl-paragraph',
  template: `
    <p>
      opl-paragraph works!
    </p>
  `,
  styleUrls: ['./opl-paragraph.component.scss']
})
export class OplParagraphComponent implements OnInit {

  constructor(oplservice: OplService) { }

  ngOnInit() {
  }

}

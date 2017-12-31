import { Component, OnInit, Input } from '@angular/core';
import { oplFunctions} from "../opl-functions";

@Component({
  selector: 'opcloud-opl-sentence',
  template: `
    <div>
      {{opl}}
    </div>
  `,
  styleUrls: ['./opl-sentence.component.scss']
})
export class OplSentenceComponent implements OnInit {
  @Input() replacePairs;
  @Input() template;
  public opl;

  constructor() {
    this.opl = this.template;
    for (const code of Object.keys(this.replacePairs)){
      this.opl = oplFunctions.replaceInTemplate(code, this.replacePairs[code], this.template);
    }
  }

  ngOnInit() {
  }

}

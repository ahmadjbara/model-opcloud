import {OpmThing} from './OpmThing';
import {basicDefinitions} from "../config/basicDefinitions";
import * as common from '../common/commonFunctions';
export class OpmProcess extends OpmThing {
  constructor(){
    super();
    this.set(this.processAttributes());
    this.attr({text: {text: 'Process'}});
    this.attr({ellipse: {stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}});
    this.attr({ellipse: this.entityShape()});
    this.attr({ellipse: this.thingShape()});
    console.log("process");
  }
  processAttributes() {
    return {
      markup: `<g class="rotatable"><g class="scalable"><ellipse/></g><text/></g>`,
      type: 'opm.Process',
      padding: 35
    };
  }
  processAttrs() {
    return {
      ellipse: {
        ...this.entityShape(), ...this.thingShape(),
        ...{stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}
      },
      'text': {text: 'Process'}
    };
  }

}

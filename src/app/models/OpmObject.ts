import {OpmThing} from './OpmThing';
import {OpmLogicalElement} from "./LogicalPart/OpmLogicalElement";
import {OpmVisualProcess} from "./VisualPart/OpmVisualProcess";
import {OpmVisualState} from "./VisualPart/OpmVisualState";
import {basicDefinitions} from "../config/basicDefinitions";
import * as common from '../common/commonFunctions';

export class OpmObject extends OpmThing {

  initialize() {
    super.initialize();
    this.set(this.objectAttributes());
  //  this.attr(this.objectAttrs());
    this.attr({text: {text: 'Object'}});
    this.attr({rect: {stroke: '#00AA00'}});
    this.attr({rect: this.entityShape()});
    this.attr({rect: this.thingShape()});

  }
  objectAttributes() {
    return {
      markup: `<g class="rotatable"><g class="scalable"><rect/></g><text/></g>`,
      type: 'opm.Object',
      padding: 15
    };
  }
  objectAttrs() {
    return {
      rect: {...this.entityShape(), ...this.thingShape(), ...{stroke: '#00AA00'}},
      'statesArrange' : 'bottom',
      'text' : {text: 'Object'}
    };
  }
}

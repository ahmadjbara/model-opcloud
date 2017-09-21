import {OpmThing} from './OpmThing';
import {OpmLogicalElement} from "./LogicalPart/OpmLogicalElement";
import {OpmVisualProcess} from "./VisualPart/OpmVisualProcess";
import {OpmVisualState} from "./VisualPart/OpmVisualState";


export class OpmObject extends OpmThing {

  initialize() {
    super.initialize();
    this.set(this.objectAttributes());
    this.attr(this.objectAttrs());

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

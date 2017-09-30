import {OpmThing} from './OpmThing';
import {OpmLogicalElement} from "../LogicalPart/OpmLogicalElement";
import {OpmVisualProcess} from "../VisualPart/OpmVisualProcess";
import {OpmVisualState} from "../VisualPart/OpmVisualState";
import {basicDefinitions} from "../../config/basicDefinitions";
import * as common from '../../common/commonFunctions';
import * as ConfigurationOptions from '../ConfigurationOptions';

export class OpmObject extends OpmThing {
  constructor() {
    super();
    this.set(this.objectAttributes());
    //  this.attr(this.objectAttrs());
    this.attr({text: {text: 'Object'}});
    this.attr({rect: {stroke: '#00AA00'}});
    this.attr({rect: this.entityShape()});
    this.attr({rect: this.thingShape()});
    this.attr({'statesArrange': 'bottom'});
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

  getParams() {
    const params = {
      fill: this.attr('rect/fill'),
      strokeColor: this.attr('rect/stroke'),
      strokeWidth: this.attr('rect/stroke-width'),
      statesArrangement: this.attr('statesArrange'),
      valueType: this.attr('value/valueType'),
      value: this.attr('value/value'),
      units: this.attr('value/units')
    };
    return {...super.getThingParams(), ...params};
  }
}
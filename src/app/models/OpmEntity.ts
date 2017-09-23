import * as common from '../common/commonFunctions';
import {basicDefinitions} from '../config/basicDefinitions';

const entityText = {
  fill: 'black',
  'font-size': 14,
  'ref-x': .5,
  'ref-y': .5,
  'x-alignment': 'middle',
  'y-alignment': 'middle',
  'font-family': 'Arial, helvetica, sans-serif',
};

const entityDefinition = {
  defaults: common._.defaultsDeep({
    size: {width: 90, height: 50},
    attrs: {
      'text': entityText,
      'wrappingResized' : false,
      'manuallyResized' : false,
    }
  }, common.joint.shapes.basic.Generic.prototype.defaults),
};

export class OpmEntity extends common.joint.dia.Element.extend(entityDefinition) {

  entityShape() {
    return {
      fill: '#DCDCDC',
      magnet: true,
      'stroke-width': 2,
    };
  }
}

export  class OpmEntity2 extends common.joint.dia.Element.extend(entityDefinition) {
  initialize() {
    super.initialize();
  }
  entityShape() {
    return {
      fill: '#DCDCDC',
      magnet: true,
      'stroke-width': 2,
    };
  }
}

import * as common from '../common/commonFunctions';

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
    attrs: {
      'text': entityText,
      'wrappingResized' : false,
      'manuallyResized' : false,
    }
  }, common.joint.shapes.basic.Generic.prototype.defaults)
}
class EntityDefinition{
  static entityDefinition(){
    return {defaults: common._.defaultsDeep({
      attrs: {
        'text': EntityDefinition.entityText,
        'wrappingResized' : false,
        'manuallyResized' : false,
      }
    }, common.joint.shapes.basic.Generic.prototype.defaults)};
  }
  static entityText(){
    return {
      fill: 'black',
      'font-size': 14,
      'ref-x': .5,
      'ref-y': .5,
      'x-alignment': 'middle',
      'y-alignment': 'middle',
      'font-family': 'Arial, helvetica, sans-serif',
    };
  }
}

export  class OpmEntity extends common.joint.dia.Element.extend(entityDefinition) {
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

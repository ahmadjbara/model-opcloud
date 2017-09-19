import {OpmEntity} from './OpmEntity';

export  class OpmThing extends OpmEntity {
  initialize() {
    super.initialize();
    this.set(this.thingAttributes());
    this.attr('text/font-weight', 600);
  }
  thingShape() {
    return {
      filter: {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}, attrs: {width: 5, height: 5}},
      width: 90,
      height: 50,
    };
  }
  thingAttributes() {
    return {
      size: {width: 90, height: 50},
      minSize: {width: 90, height: 50},
      'statesWidthPadding' : 0,
      'statesHeightPadding' : 0,
      'value' : {'value' : 'None', 'valueType' : 'None', 'units' : ''}
    };
  }
}

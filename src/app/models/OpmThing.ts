import {OpmEntity} from './OpmEntity';

export  class OpmThing extends OpmEntity {
  constructor() {
    super();
    this.set(this.thingAttributes());
    this.attr({text: {'font-weight': 600}});
    this.attr({value: {'value': 'None', 'valueType': 'None', 'units': ''}});
  }

  thingShape() {
    return {
      filter: {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}},
      width: 90,
      height: 50,
    };
  }
  thingAttributes() {
    return {
    //  size: {width: 90, height: 50},
      minSize: {width: 90, height: 50},
      statesWidthPadding: 0,
      statesHeightPadding: 0,
      value: {'value': 'None', 'valueType': 'None', 'units': ''}
    };
  }
  getThingParams() {
    const params = {
      shadow: (this.attr('ellipse/filter/args/dx') === 0) ? false : true,
      stroked: (this.attr('ellipse/stroke-dasharray') === 0) ? false : true,
    };
    return {...super.getEntityParams(), ...params};
  }
}

import {OpmEntity} from './OpmEntity';

export  class OpmState extends OpmEntity {
  initialize() {
    super.initialize();
    this.set(this.stateAttributes());
    this.attr(this.stateAttrs());

  }
  stateAttributes() {
    return {
      markup: `<g class="rotatable"><g class="scalable"><rect/></g><text/></g>`,
      type: 'opm.State',
      size: {width: 50, height: 25},
      minSize: {width: 50, height: 25},
      padding: 10,
      'father': null,
    };
  }
  stateAttrs() {
    return {
      rect: {...this.entityShape(), ...{width: 50, height: 25, stroke: '#808000', rx: 10, ry: 10, cx: null, cy: null}},
      'text' : {text: 'State', 'font-weight': 300}
    };
  }
}

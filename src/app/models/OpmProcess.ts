import {OpmThing} from './OpmThing';

export class OpmProcess extends OpmThing {
  initialize() {
    super.initialize();
    this.set(this.processAttributes());
    this.attr(this.processAttrs());
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
      ellipse: {...this.entityShape(), ...this.thingShape(),
        ...{stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}},
      'text' : {text: 'Process'}
    };
  }
}

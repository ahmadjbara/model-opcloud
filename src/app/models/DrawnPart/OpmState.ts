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
  getParams() {
    const params = {
      fill: this.attr('rect/fill'),
      strokeColor: this.attr('rect/stroke'),
      strokeWidth: this.attr('rect/stroke-width'),
      fatherObjectId: this.get('father')
    };
    return {...super.getEntityParams(), ...params};
  }
  changeSizeHandle() {
    super.changeSizeHandle();
    // Need to update the size of it's object so that the state will not
    // stay out of it's border
    const parentId = this.get('parent');
    const parent = this.graph.getCell(parentId);
    parent.updateSizeToFitEmbeded();
  }
  changePositionHandle() {
    super.changePositionHandle();
    // When state is changing it's position, the object need to change it's size accordingly
    const parentId = this.get('parent');
    const parent = this.graph.getCell(parentId);
    parent.updateSizeToFitEmbeded();
  }
  removeHandle(options) {
    const fatherObject = options.graph.getCell(this.get('father'));
    if (fatherObject.get('embeds').length === 0) {
      fatherObject.arrangeEmbededParams(0.5, 0.5, 'middle', 'middle', 'bottom', 0, 0);
      fatherObject.updateTextAndSize();
    }
  }
}

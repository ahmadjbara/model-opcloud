import {OpmEntity} from './OpmEntity';
import {arrangeEmbedded} from '../../configuration/elementsFunctionality/arrangeStates';

export  class OpmState extends OpmEntity {
  constructor(stateName = 'State') {
    super();
    this.set(this.stateAttributes());
    this.attr(this.stateAttrs(stateName));
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
  stateAttrs(stateName) {
    return {
      rect: {...this.entityShape(), ...{width: 50, height: 25, stroke: '#808000', rx: 6, ry: 6, cx: null, cy: null}},
      'text' : {text: stateName, 'font-weight': 300}
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
      // if the state was a value of the object then delete the value from the object
      if (fatherObject.attr('value/value')) {
        fatherObject.attr({value: {value: 'None'}});
        fatherObject.set('previousValue', null);
      }
    } else {
      arrangeEmbedded(fatherObject, fatherObject.attr('statesArrange'));
    }
  }
  haloConfiguration(halo, options) {
    halo.addHandle(this.addHandleGenerator('toggleSuppression', 'ne', 'Click to supress state', 'left'));
  }
  /*
  suppression() {
    const pseudoState =
//      new joint.shapes.opm.StateNormSuppress(basicDefinitions.defineStateSuppression());
    // console.log(cell.graph.attributes.cells.models[0].getEmbeddedCells());
    const Ancestor = cell.graph.attributes.cells.models[0];
    const all = Ancestor.getEmbeddedCells();
    for (let k = 0; k < all.length; k++) {
      if (all[k].attributes.attrs.text.text === '...')
        return;
    }
    cell.graph.addCell(secondaryState);
    Ancestor.embed(secondaryState);     // makes the state stay in the bounds of the object
    secondaryState.attr('text/text', '...');
    const xNewState = Ancestor.getBBox().center().x + Ancestor.getBBox().width / 2 ;
    const yNewState = Ancestor.getBBox().center().y  + Ancestor.getBBox().height  - basicDefinitions.stateHeight ;
    secondaryState.set({position: {x: xNewState  , y: yNewState  }});
  }
  */
}

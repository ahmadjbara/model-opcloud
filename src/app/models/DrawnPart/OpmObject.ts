import {OpmThing} from './OpmThing';
import {valueHandle} from '../../configuration/elementsFunctionality/valueHandle';
import {arrangeEmbedded} from '../../configuration/elementsFunctionality/arrangeStates';
import {OpmState} from './OpmState';

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
      markup: `<g class='rotatable'><g class='scalable'><rect/></g><text/></g>`,
      type: 'opm.Object',
      padding: 10
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
  addState(stateName = null) {
    this.objectChangedSize = false;
    const statesNumber = this.getEmbeddedCells().length;
    this.createNewState((stateName ? stateName : ('state' + (statesNumber + 1))));
    // For the first time of clicking on general addState should be added 3 states
    if (!stateName && (statesNumber === 0)) {
      for (let i = 2; i <= 3; i++) {
        this.createNewState(('state' + (statesNumber + i)));
      }
    }
    // Add the new state using the current states arrangement
    if (this.get('embeds').length < 2) {
      arrangeEmbedded(this, 'bottom');
    } else {
      arrangeEmbedded(this, this.attr('statesArrange'));
    }
  }
  createNewState(stateName) {
    const defaultState = new OpmState(stateName);
    this.embed(defaultState);     // makes the state stay in the bounds of the object
    this.graph.addCells([this, defaultState]);
    // Placing the new state. By default it is outside the object.
    const xNewState = this.getBBox().center().x - defaultState.get('size').width / 2;
    const yNewState = this.get('position').y + this.get('size').height - defaultState.get('size').height;
    defaultState.set('father', defaultState.get('parent'));
    defaultState.set({position: {x: xNewState, y: yNewState}});
  }
  haloConfiguration(halo, options) {
    let hasStates = this.getEmbeddedCells().length;
    halo.addHandle(this.addHandleGenerator('add_state', 'sw', 'Click to add state to the object', 'right'));
    halo.on('action:add_state:pointerup', function () {
      hasStates = true;
      halo.$handles.children('.arrange_up').toggleClass('hidden', !hasStates);
      halo.$handles.children('.arrange_down').toggleClass('hidden', !hasStates);
      halo.$handles.children('.arrange_left').toggleClass('hidden', !hasStates);
      halo.$handles.children('.arrange_right').toggleClass('hidden', !hasStates);
      this.options.cellView.model.addState();
    });
    halo.addHandle(this.addHandleGenerator('arrange_up', 'n', 'Arrange the states at the top inside the object', 'top'));
    halo.on('action:arrange_up:pointerup', function () {
      arrangeEmbedded(this.options.cellView.model, 'top');
    });
    halo.addHandle(this.addHandleGenerator('arrange_down', 's', 'Arrange the states at the bottom inside the object', 'bottom'));
    halo.on('action:arrange_down:pointerup', function () {
      arrangeEmbedded(this.options.cellView.model, 'bottom');
    });
    halo.addHandle(this.addHandleGenerator('arrange_right', 'w', 'Arrange the states to the left inside the object', 'left'));
    halo.on('action:arrange_right:pointerup', function () {
      arrangeEmbedded(this.options.cellView.model, 'left');
    });
    halo.addHandle(this.addHandleGenerator('arrange_left', 'e', 'Arrange the states to the right inside the object', 'right'));
    halo.on('action:arrange_left:pointerup', function () {
      arrangeEmbedded(this.options.cellView.model, 'right');
    });
    halo.$handles.children('.arrange_up').toggleClass('hidden', !hasStates);
    halo.$handles.children('.arrange_down').toggleClass('hidden', !hasStates);
    halo.$handles.children('.arrange_left').toggleClass('hidden', !hasStates);
    halo.$handles.children('.arrange_right').toggleClass('hidden', !hasStates);
  }
  changeAttributesHandle() {
    super.changeAttributesHandle();
    valueHandle.updateCell(this);
  }
  changeSizeHandle() {
    super.changeSizeHandle();
    // In case object has states, need to update the size so that the states will not
    // stay out of it's border
    if (this.get('embeds') && this.get('embeds').length) {
      this.objectChangedSize = true;
      this.updateSizeToFitEmbeded();
    }
  }
  changePositionHandle() {
    super.changePositionHandle();
    // Changing Object's size from the left size cause position event
    if (this.get('embeds') && this.get('embeds').length) {
      if (this.objectChangedSize) {
        this.updateSizeToFitEmbeded();
        this.objectChangedSize = false;
      }
    }
  }
}

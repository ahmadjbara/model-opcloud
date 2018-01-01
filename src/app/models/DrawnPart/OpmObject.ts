import {OpmThing} from './OpmThing';
import {arrangeEmbedded} from '../../configuration/elementsFunctionality/arrangeStates';
import {OpmState} from './OpmState';
import {joint, _} from '../../configuration/rappidEnviromentFunctionality/shared';
import {OpmProcess} from "./OpmProcess";
import {TriangleClass} from "./Links/OpmFundamentalLink";
import {linkDrawing} from "../../configuration/elementsFunctionality/linkDrawing";
import {ResultLink} from "./Links/ResultLink";
import {ConsumptionLink} from "./Links/ConsumptionLink";

const initial_subprocess_inzooming = 3;
const Facotr = 0.8;
const inzoomed_height = 200;
const inzoomed_width = 300;
const x_margin = 70;
const y_margin = 10; // height margin between subprocess
const childMargin = 55;

export class OpmObject extends OpmThing {

  static counter: number =0;

  constructor() {
    super();
    this.set(this.objectAttributes());
    this.attr(this.objectAttrs());
  }

  objectAttributes() {
    return {
      markup: `<g class='rotatable'><g class='scalable'><rect/></g><text/></g>`,
      type: 'opm.Object',
      padding: 10,
      logicalValue: null
    };
  }

  getCounter() {
    return ++OpmObject.counter;
  }

  objectAttrs() {
    return {
      rect: {...this.entityShape(), ...this.thingShape(), ...{stroke: '#00AA00'}},
      'statesArrange' : 'bottom',
      'text' : {text: 'Object'},
      value: {value: 'None', valueType: 'None', units: ''}
    };
  }
  getParams() {
    const params = {
      statesArrangement: this.attr('statesArrange'),
      valueType: this.attr('value/valueType'),
      value: this.attr('value/value'),
      units: this.attr('value/units'),
    };
    return {...super.getThingParams(), ...params};
  }
  updateParamsFromOpmModel(visualElement) {
    const attr = {
      rect: {...this.updateEntityFromOpmModel(visualElement), ...this.updateThingFromOpmModel(visualElement), ...{stroke: visualElement.strokeColor}},
      'statesArrange' : this.getStateArrangement(visualElement.statesArrangement),
      value: {value: visualElement.logicalElement.value, valueType: visualElement.logicalElement.valueType, units: visualElement.logicalElement.units}
    };
    this.attr(attr);
  }
  getStateArrangement(statesArrangement) {
    if (statesArrangement) {
      switch (statesArrangement) {
        case (statesArrangement.Top):
          return 'top';
        case (statesArrangement.Bottom):
          return 'bottom';
        case (statesArrangement.Left):
          return 'left';
        case (statesArrangement.Right):
          return 'right';
      }
    }
  }
  addState(stateName = null) {
    this.objectChangedSize = false;
    const statesNumber = this.getEmbeddedCells().length;
    this.createNewState((stateName ? stateName : ('state' + (statesNumber + 1))));
    // For the first time of clicking on general addState should be added 3 states
    if (!stateName && (statesNumber === 0)) {
      for (let i = 2; i <= 2; i++) {
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
    super.haloConfiguration(halo, options);
    const thisObject = this;
    let hasStates = this.getEmbeddedCells().length;
    halo.addHandle(this.addHandleGenerator('add_state', 'ne', 'Click to add state to the object', 'right'));
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
  computation(target) {
    const objectThis = this;
    const popup = new joint.ui.Popup({
      events: {
        'click .btnUpdate': function() {
          const value = this.$('.value').val();
          const units = (this.$('.units').val() !== 'units') ? this.$('.units').val() : '';
          const type = this.$('.type').val();
          objectThis.attr({value: {value: value, units: units, valueType: type}});
          this.remove();
        }
      },
      content: ['<input class="value" value="value" size="7"><br>',
        '<input class="units" value="units" size="7"><br>',
        '<select class="type">' +
        '<option value="Number">Number</option>' +
        '<option value="String">String</option>' +
        '<option value="None">None</option>' +
        '</select><br>',
        '<button class="btnUpdate">Update</button>'],
      target: target
    }).render();
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
  updatecomputationalPart() {
    const valueType = this.attr('value/valueType');
    const value = this.attr('value/value');
    const units = this.attr('value/units');
    if ((valueType !== 'None') && (this.attr('rect/filter/args/dx') !== 0)) {
      this.attr('rect/filter/args', {dx: 0, dy: 0, blur: 0, color: 'grey'});
    }
    // the value is saved twice: once in the attr, for visual representation inside
    // a state and once in 'logicalValue' field for background execution use.
    if ((!this.get('previousValue') || (value !== this.get('previousValue'))) && (value !== 'None')) {
      this.updateState(value);
      this.set('logicalValue', value);
    }
    if ((!this.get('previousUnits') || (units !== this.get('previousUnits'))) && (units !== '')) {
      this.updateUnits(units);
    }
  }
  //  When a value of an object is updated, if a state exists - its value will be updated,
  // otherwise - a new state will be added with the new value
  updateState(value) {
    this.set('previousValue', value);
    let statesNumber = 0;   // currently only one value for object is allowed
    _.each(this.getEmbeddedCells(), function(child) {
      statesNumber ++;
      // There is already a state with a value - updating the value
      child.attr({text: {text: value}});
    });
    // If got to this line then it means that there is no state yet and need to add a new state
    if (statesNumber === 0) {
      this.addState(value);
    }
  }
  updateUnits(units) {
    this.set('previousUnits', units);
    let newText = this.attr('text/text');
    const indexOfStartUnits = newText.lastIndexOf('[');
    if (indexOfStartUnits > 0) {    // At the first time it will be -1, meaning no units were  defined yet
      newText  = newText.substring(0, indexOfStartUnits) + '[' + units + ']';
    } else {
      newText = newText + '\n[' + units + ']';
    }
    this.attr({text: {text: newText}});
  }
  updateShapeAttr(newValue) {
    this.attr('rect', newValue);
  }
  getShapeAttr() {
    return this.attr('rect');
  }
  changeEssence() {
    (this.attr('rect').filter.args.dx === 0) ? this.attr('rect/filter/args', {dx: 3, dy: 3}) :
      this.attr('rect/filter/args', {dx: 0, dy: 0});
  }
  changeAffiliation() {
    (this.attr('rect')['stroke-dasharray'] === '0') ? this.attr('rect', {'stroke-dasharray':
      '10,5'}) : this.attr('rect', {'stroke-dasharray': '0'});
  }
  getShapeFillColor() {
    return this.attr('rect/fill');
  }
  getShapeOutline() {
    return this.attr('rect/stroke');
  }
  getImageEssenceAffiliation() {
    return '../../../assets/icons/essenceAffil/EssenceAffilObject.JPG';
  }
  processInzooming (evt, x, y, options, cellRef, links) {



    // var options = _this.options;
    const parentObject = cellRef;

    parentObject.set('padding', 100);


    // options.graph.addCell(parentObject);

    // console.log(links);
    // options.graph.addCells(links);

    console.log(parentObject);
    parentObject.attributes.attrs.text['ref-y'] = .05;
    parentObject.attributes.attrs.text['ref-x'] = .5;
    parentObject.attributes.attrs.text['text-anchor'] = 'middle';
    parentObject.attributes.attrs.text['y-alignment'] = 'top';

    // parentObject.attributes.attrs.text({refx:'30%'});
    // zoom out current elements in the paper
    const cells = cellRef.graph.getElements();
    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      const cell = cells[cellIndex];
      if (!(cell instanceof OpmState)) {
        const cellSize = cell.get('size');
        cell.resize(cellSize.width * Facotr, cellSize.height * Facotr);
      }
    }

    // end of zoom out

    // resize the in-zoomed process
    parentObject.resize(inzoomed_height, inzoomed_width, options);

    // create the initial subprcoess
    let dy = y_margin;

    for (let i = 0; i < initial_subprocess_inzooming; i++) {
      const yp = y + dy + 50;
      const xp = x + childMargin;
      // let defaultProcess = new joint.shapes.opm.Process(basicDefinitions.defineShape('ellipse'));
      let defaultProcess = new OpmObject();
      defaultProcess.set('position', {x: xp, y: yp});
      parentObject.embed(defaultProcess);     // makes the state stay in the bounds of the object
      options.graph.addCells([parentObject, defaultProcess]);
      dy += x_margin;
      // console.log('child object2'+JSON.stringify(defaultProcess));
    }

    parentObject.updateSizeToFitEmbeded();
    parentObject.set('statesHeightPadding', 30);



    // parentObject.embeds
    const EmbeddedCells = parentObject.getEmbeddedCells();
    const first_process_id = EmbeddedCells[0].id;
    const last_process_id = EmbeddedCells[(initial_subprocess_inzooming - 1)].id;


    options.graph.getConnectedLinks(parentObject, { inbound: true }).forEach(function(link) {
      if (link instanceof ConsumptionLink) {
        link.set('target', {id: first_process_id});
        // Ahmad: I don't like this solution. For now it solves the problem of navigating
        // between OPDs when there is a consumption link. Need to find where is a circular pointer created in the code.
        link.attributes.graph = null;
      }
    });

    options.graph.getConnectedLinks(parentObject, { outbound: true}).forEach(function(link) {
      if (link instanceof ResultLink) {
        link.set('source', {id: last_process_id});
      }
    });
    options.graph.on('change:position change:size', function (cell, value, opt) {


      if (opt.cameFrom === 'textEdit') {
        const maxWidth = opt.wd > value.width ? opt.wd : value.width;
        const maxHeight = opt.hg > value.height ? opt.hg : value.height;
        cell.resize(maxWidth, maxHeight);
        return;
      }
      cell.set('originalSize', cell.get('size'));
      cell.set('originalPosition', cell.get('position'));
      const parentId = cell.get('parent');
      if (parentId) {
        const parent = options.graph.getCell(parentId);
        if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
        if (cell.attributes.attrs.wrappingResized) {
          parent.updateSizeToFitEmbeded();
          return;
        }
        if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
        if (parent instanceof OpmObject) {
          parent.updateSizeToFitEmbeded();
          console.log(cell);
        }

      } else if (cell.get('embeds') && cell.get('embeds').length) {
        // if (cell.attributes.attrs.wrappingResized){
        //  common.CommonFunctions.updateSizeToFitEmbeded(cell);
        //  return;
        // }

        cell.updateSizeToFitEmbeded();
      }
    });
  }
  processUnfolding (options, cellRef, unfoldingOptions) {

    let x = cellRef.get('position').x;
    x = this.getRightmostXCoord(cellRef, options.graph) + 20;
    let y = cellRef.get('position').y + 160;

    for (var prop in unfoldingOptions) {

      console.log(prop);
      if (unfoldingOptions[prop] === false || this.linkAlreadyExist(cellRef, prop, options))
        continue;
      console.log(prop);
      for (let i = 0; i < 2; i++) {

        let defaultProcess;
        if (prop === 'Exhibition-Characterization-Attributes')
          defaultProcess = new OpmObject();
        else
          defaultProcess = new OpmProcess();
        defaultProcess.set('position', {x: x, y: y});
        options.graph.addCell(defaultProcess);

        let link;
        linkDrawing.drawLinkSilent(options.graph, prop, cellRef, defaultProcess);

        x = x + defaultProcess.get('size').width + 20;

      }
    }
  }


  linkAlreadyExist(cellRef, prop, options){
    let links = options.graph.getConnectedLinks(cellRef);
    for (let k=0; k<links.length; k++) {
      console.log(links[k].attributes.OpmLinkType==="ExhibitionLink");
      console.log(prop.includes('Attribues'));
      console.log(this.linkHasAttribute(links[k], options.graph));
      if (links[k].attributes.OpmLinkType==="ExhibitionLink" && prop.includes('Attributes') && this.linkHasAttribute(links[k], options.graph))
        return true;
      else if (links[k].attributes.OpmLinkType==="ExhibitionLink" && prop.includes('Operations') && this.linkHasOperation(links[k], options.graph))
        return true;
      else if (links[k].attributes.OpmLinkType==="GeneralizationLink" && prop.includes('Generalization'))
        return true;
      else if (links[k].attributes.OpmLinkType==="AggregationLink" && prop.includes('Aggregation'))
        return true;
      else if (links[k].attributes.OpmLinkType==="InstantiationLink" && prop.includes('Instantiation'))
        return true;
    }
    return false;
  }
  linkHasAttribute(link, graph){
    if (link.getTargetElement() instanceof  TriangleClass){
      let links = graph.getConnectedLinks(link.getTargetElement());
      for (let k=0; k<links.length; k++)
        if (links[k].getTargetElement() instanceof OpmObject)
          return true;
    }
    return false;
  }
  linkHasOperation(link, graph){
    if (link.getTargetElement() instanceof  TriangleClass){
      let links = graph.getConnectedLinks(link.getTargetElement());
      for (let k=0; k<links.length; k++)
        if (links[k].getTargetElement() instanceof OpmProcess)
          return true;
    }
    return false;
  }
}

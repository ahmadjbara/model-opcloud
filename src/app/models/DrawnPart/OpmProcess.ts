import {OpmThing} from './OpmThing';
import {processInzooming, processUnfolding} from '../../configuration/elementsFunctionality/process-inzooming';
import {OpmVisualProcess} from '../VisualPart/OpmVisualProcess';
import {OpmOpd} from '../OpmOpd';
import {joint, _, paddingObject} from '../../configuration/rappidEnviromentFunctionality/shared';
import {code} from "../ConfigurationOptions";
import {TriangleClass} from "./Links/OpmFundamentalLink";
import {OpmObject} from "./OpmObject";
import {linkDrawing} from "../../configuration/elementsFunctionality/linkDrawing";
import {ResultLink} from "./Links/ResultLink";
import {ConsumptionLink} from "./Links/ConsumptionLink";
import {OpmState} from "./OpmState";

const initial_subprocess_inzooming = 3;
const Facotr = 0.8;
let inzoomed_height;
const inzoomed_width = 200;
const x_margin = 70;
const y_margin = 10; // height margin between subprocess
const childMargin = 55;

export class OpmProcess extends OpmThing {

  static counter: number =0;

  constructor() {
    super();
    this.set(this.processAttributes());
    this.attr({text: {text: 'Process'}});
    this.attr({ellipse: {stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}});
    this.attr({ellipse: this.entityShape()});
    this.attr({ellipse: this.thingShape()});
  }
  processAttributes() {
    return {
      markup: `<g class='rotatable'><g class='scalable'><ellipse/></g><text/></g>`,
      type: 'opm.Process',
      padding: 35
    };
  }

  getCounter() {
    return ++OpmProcess.counter;
  }

  processAttrs() {
    return {
      ellipse: {
        ...this.entityShape(), ...this.thingShape(),
        ...{stroke: '#0000FF', rx: 40, ry: 40, cx: 40, cy: 40}
      },
      'text': {text: 'Process'}
    };
  }
  getParams() {
    const functionValue = this.attr('value/value');
    const params = {
      code: functionValue,
      insertedFunction: (functionValue === 'userDefined') ? this.get('userDefinedFunction') : functionValue
    };
    return {...super.getThingParams(), ...params};
  }
  updateParamsFromOpmModel(visualElement) {
    let value, userDefinedFunction;
    if (visualElement.logicalElement.code === code.Unspecified) {
      value = 'None';
    } else if (visualElement.logicalElement.code === code.PreDefined) {
      value = visualElement.logicalElement.insertedFunction;
    } else {
      value = 'userDefined';
      userDefinedFunction = visualElement.logicalElement.insertedFunction;
    }
    const attr = {
      ellipse: {...this.updateEntityFromOpmModel(visualElement), ...this.updateThingFromOpmModel(visualElement), ...{stroke: visualElement.strokeColor}},
      value: {value: value}
    };
    this.attr(attr);
    const father = visualElement.refineable ? visualElement.refineable.id : null;
    const attributes = {
      userDefinedFunction: userDefinedFunction,
      //parent: this.get('parent') ? this.get('parent') : father
    };
    this.set(attributes);
  }
  removeHandle(options) {
    options.treeViewService.removeNode(this.id);
  }
  updateProcessSize() {
    let leftSideX = this.get('position').x;
    let topSideY = this.get('position').y;
    let rightSideX = this.get('position').x + this.get('size').width;
    let bottomSideY = this.get('position').y + this.get('size').height;

    const elps = joint.g.ellipse.fromRect(this.getBBox());
    _.each(this.getEmbeddedCells(), function(child) {

      const childBbox = child.getBBox();
      // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object

      if (!elps.containsPoint(childBbox.bottomLeft())) {
        bottomSideY = bottomSideY + paddingObject;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.origin())) {
        topSideY = topSideY - paddingObject ;
        leftSideX = leftSideX - paddingObject;
      }
      if (!elps.containsPoint(childBbox.corner())) {
        bottomSideY = bottomSideY + paddingObject;
        rightSideX = rightSideX + paddingObject;
      }
      if (!elps.containsPoint(childBbox.topRight())) {
        topSideY = topSideY - paddingObject ;
        rightSideX = rightSideX + paddingObject;
      }
    });
    this.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }}, {skipExtraCall: true});
  }
  // options = init-rappid service
  computation(target) {
    const processThis = this;
    const contextToolbar = new joint.ui.ContextToolbar({
      theme: 'modern',
      tools: [{ action: 'predefined',  content: 'predefined'},
        { action: 'userDefined',  content: 'user defined'},
        { action: 'imported',  content: 'imported'}],
      target: target,
      padding: 30
    }).render();
    contextToolbar.on('action:predefined', function() {
      this.remove();
      processThis.predefinedFunctions(target);
    });
    contextToolbar.on('action:userDefined', function() {
      this.remove();
      processThis.userDefinedFunction(target);
    });
  }
  userDefinedFunction (target) {
    const processThis = this;
    const currentFunction = processThis.get('userDefinedFunction') ? processThis.get('userDefinedFunction').functionInput : 'return a+b;';
    const currentParameters = processThis.get('userDefinedFunction') ? processThis.get('userDefinedFunction').parameters : 'a, b';
    const popup = new joint.ui.Popup({
      events: {
        'click .btnUpdate': function() {
          const parameters = this.$('.parameters').val();
          const functionInput = this.$('.functionInput').val();
          processThis.attr({value: {value: 'userDefined'}});
          processThis.set('userDefinedFunction', {parameters: parameters, functionInput: functionInput});
          this.remove();
        }
      },
      content: ['Arguments: <input class="parameters" value="' + currentParameters + '" size="7"><br>',
        'Function:<br><textarea class="functionInput" rows="7" cols="30">' + currentFunction + '</textarea><br>',
        '<button class="btnUpdate">Update</button>'],
      target: target
    }).render();
  }
  predefinedFunctions (target) {
    const processThis = this;
    const popup = new joint.ui.Popup({
      events: {
        'click .btnUpdate': function() {
          const valueFunction = this.$('.value').val();
          processThis.attr({value: {value: valueFunction}});
          this.remove();
          alert('check consistence of process name and its functionality');
        }
      },
      content: ['<select class="value">' +
      '<option value="Adding">Adding</option>' +
      '<option value="Subtracting">Subtracting</option>' +
      '<option value="Multiplying">Multiplying</option>' +
      '<option value="Dividing">Dividing</option>' +
      '</select><br>',
        '<button class="btnUpdate">Update</button>'],
      target: target
    }).render();
  }
  updatecomputationalPart() {
    // value is the chosen function
    const value = this.attr('value/value');
    let newText = this.attr('text/text');
    if (value === 'None') {
      if (newText.lastIndexOf('()') !== -1) {
        newText = newText.replace('()', '');
        this.attr({text: {text: (newText.trim())}});
      }
    } else {
      if (newText.lastIndexOf('()') === -1) {
        this.attr({text: {text: (newText + ' ()')}});
      }
      if (this.attr('ellipse/filter/args/dx') !== 0) {
        this.attr('ellipse/filter/args', {dx: 0, dy: 0, blur: 0, color: 'grey'});
      }
    }
  }
  updateShapeAttr(newValue) {
    this.attr('ellipse', newValue);
  }
  changeEssence() {
    (this.attr('ellipse').filter.args.dx === 0) ? this.attr('ellipse/filter/args', {dx: 3, dy: 3}) :
      this.attr('ellipse/filter/args', {dx: 0, dy: 0});
  }
  changeAffiliation() {
    (this.attr('ellipse')['stroke-dasharray'] === '0') ? this.attr('ellipse', {'stroke-dasharray':
      '10,5'}) : this.attr('ellipse', {'stroke-dasharray': '0'});
  }
  getShapeAttr() {
    return this.attr('ellipse');
  }
  getShapeFillColor() {
    return this.attr('ellipse/fill');
  }
  getShapeOutline() {
    return this.attr('ellipse/stroke');
  }
  getImageEssenceAffiliation() {
    return '../../../assets/icons/essenceAffil/EssenceAffilProcess.JPG';
  }
  processInzooming (evt, x, y, options, cellRef, links) {
    // var options = _this.options;
    const parentObject = cellRef;
    parentObject.set('padding', 100);

    parentObject.attributes.attrs.text['ref-y'] = .1;
    parentObject.attributes.attrs.text['ref-x'] = .5;
    parentObject.attributes.attrs.text['text-anchor'] = 'middle';
    parentObject.attributes.attrs.text['y-alignment'] = 'top';

    inzoomed_height = initial_subprocess_inzooming * (new OpmProcess().get('size').height + 2*y_margin + 10);

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

    // resize the in-zoomed process
    parentObject.resize(inzoomed_width, inzoomed_height, options);

    // create the initial subprcoess
    let dy = y_margin;

    for (let i = 0; i < initial_subprocess_inzooming; i++) {
      const yp = y + dy + inzoomed_height*0.1 + 20;
      const xp = x + childMargin;
      let defaultProcess = new OpmProcess();

      defaultProcess.set('position', {x: xp, y: yp});
      parentObject.embed(defaultProcess);     // makes the state stay in the bounds of the object
      options.graph.addCells([parentObject, defaultProcess]);
      dy += x_margin;
    }
    parentObject.updateProcessSize();
    parentObject.set('statesHeightPadding', 150);

    // parentObject.embeds
    const EmbeddedCells = parentObject.getEmbeddedCells();
    const first_process_id = EmbeddedCells[0].id;
    const last_process_id = EmbeddedCells[(initial_subprocess_inzooming - 1)].id;


    options.graph.getConnectedLinks(parentObject, { inbound: true }).forEach(function(link) {
      if (link instanceof ConsumptionLink) {
        link.set('target', {id: first_process_id}, {cameFromInZooming: true});
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
      console.log(cell);
      if (opt.cameFromFitEmbeds===true)
        return;
      if (opt.cameFrom === 'textEdit') {
        const maxWidth = opt.wd > value.width ? opt.wd : value.width;
        const maxHeight = opt.hg > value.height ? opt.hg : value.height;
        cell.resize(maxWidth, maxHeight);
        console.log('a');
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
          console.log('b');
          return;
        }
        if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));
        if (parent instanceof OpmProcess) {
          parent.updateProcessSize();
          console.log('c');
        }
      } else if (cell.get('embeds') && cell.get('embeds').length) {
        cell.updateSizeToFitEmbeded();
        console.log('d');
      }
    });
  }
  processUnfolding (options, cellRef, unfoldingOptions) {

    let x = cellRef.get('position').x;
    x = this.getRightmostXCoord(cellRef, options.graph) + 20;
    let y = cellRef.get('position').y + 160;

    for (var prop in unfoldingOptions) {
      if (unfoldingOptions[prop] === false || this.linkAlreadyExist(cellRef, prop, options))
        continue;
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
    console.log("abc");
    console.log(links);
    for (let k=0; k<links.length; k++) {
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

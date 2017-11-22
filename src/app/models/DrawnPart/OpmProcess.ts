import {OpmThing} from './OpmThing';
import {processInzooming, processUnfolding} from '../../configuration/elementsFunctionality/process-inzooming';
import {OpmVisualProcess} from '../VisualPart/OpmVisualProcess';
import {OpmOpd} from '../OpmOpd';
import {joint, _, paddingObject} from '../../configuration/rappidEnviromentFunctionality/shared';

export class OpmProcess extends OpmThing {
  constructor() {
    super();
    this.set(this.processAttributes());
    this.attr({text: {text: 'Processing'}});
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
    const params = {
      fill: this.attr('ellipse/fill'),
      strokeColor: this.attr('ellipse/stroke'),
      strokeWidth: this.attr('ellipse/stroke-width'),
      parentheses: (this.attr('value/value') === 'None') ? false : true
    };
    return {...super.getThingParams(), ...params};
  }
  removeHandle(options) {
    options.treeViewService.removeNode(this.id);
  }
  // options = init-rappid service
  haloConfiguration(halo, options) {
    super.haloConfiguration(halo, options);
    const thisProcess = this;
    halo.addHandle(this.addHandleGenerator('manage_complexity', 'sw', 'Click to manage complexity', 'left'));
    halo.on('action:manage_complexity:pointerdown', function (evt, x, y) {
      const contextToolbar = thisProcess.createContextToolbar(halo);
      const haloThis = this;
      contextToolbar.on('action:In-Zoom', function() {
        this.remove();
        let clonedProcess;
        const cellModel = haloThis.options.cellView.model;
        if (cellModel.attributes.attrs.ellipse['stroke-width'] === 4) {
          clonedProcess = options.opmModel.getVisualElementById(cellModel.id).refineeInzooming;
          let pid = clonedProcess.id;
          options.graphService.changeGraphModel(pid, options.treeViewService, 'inzoom');
        } else {
          let opd = new OpmOpd('');
          options.opmModel.addOpd(opd);
          cellModel.attributes.attrs.ellipse['stroke-width'] = 4;
          clonedProcess = options.treeViewService.insertNode(cellModel, 'inzoom', options);
          clonedProcess.set('position', {x: 350, y: 100});
          const elementlinks = options.graphService.graphLinks;
          let r;
          processInzooming(evt, 350, 100, haloThis.options, clonedProcess, elementlinks);
          let visualElement = new OpmVisualProcess(clonedProcess.getParams(), null);
          options.opmModel.getLogicalElementByVisualId(cellModel.id).add(visualElement);
          visualElement.connectRefinementElements(cellModel.id, 'inzoom');

          opd.add(visualElement);
        }
        options.treeViewService.treeView.treeModel.getNodeById(clonedProcess.id).toggleActivated();
        options.treeViewService.treeView.treeModel.getNodeById(clonedProcess.id).parent.expand();
      });
      contextToolbar.on('action:Unfold', function() {
        const contextToolbarForUnfolding = thisProcess.createContextToolbarForUnfolding(halo, options, this);
        //contextToolbarForUnfolding.render();
      });
      contextToolbar.render();
    });
  }
  computation(halo) {
    const processThis = this;
    const contextToolbar = new joint.ui.ContextToolbar({
      theme: 'modern',
      tools: [{ action: 'predefined',  content: 'predefined'},
        { action: 'userDefined',  content: 'user defined'},
        { action: 'imported',  content: 'imported'}],
      target: halo.el,
      padding: 30
    }).render();
    contextToolbar.on('action:predefined', function() {
      this.remove();
      processThis.predefinedFunctions(halo);
    });
    contextToolbar.on('action:userDefined', function() {
      this.remove();
      processThis.userDefinedFunction(halo);
    });
  }
  userDefinedFunction (halo) {
    const processThis = this;
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
      content: ['Arguments: <input class="parameters" value="a,b" size="7"><br>',
        'Function:<br><textarea class="functionInput" rows="7" cols="30">return a+b;</textarea><br>',
        '<button class="btnUpdate">Update</button>'],
      target: halo.el
    }).render();
  }
  predefinedFunctions (halo) {
    const processThis = this;
    const popup = new joint.ui.Popup({
      events: {
        'click .btnUpdate': function() {
          const valueFunction = this.$('.value').val();
          processThis.attr({value: {value: valueFunction}, text: {text: valueFunction}});
          this.remove();
        }
      },
      content: ['<select class="value">' +
      '<option value="Adding">Adding</option>' +
      '<option value="Subtracting">Subtracting</option>' +
      '<option value="Multiplying">Multiplying</option>' +
      '<option value="Dividing">Dividing</option>' +
      '</select><br>',
        '<button class="btnUpdate">Update</button>'],
      target: halo.el
    }).render();
  }
  createContextToolbar(halo) {
    return new joint.ui.ContextToolbar({
      theme: 'modern',
      tools: [
        { action: 'In-Zoom', content:  halo.options.cellView.model.attributes.attrs.ellipse['stroke-width'] === 4 ? 'Show In-Zoomed' : 'In-Zoom' },
        { action: 'Unfold', content: halo.options.cellView.model.attributes.attrs.ellipse['stroke'] === '#0096FF' ? 'Show Unfolded' : 'Unfold' }
      ],
      target: halo.el,
      autoClose: true,
      padding: 30
    });
  }
  createContentForUnfoldingOptions(icon, desc){
    return ( '<img width="25" height="20" src="../../../assets/icons/OPM_Links/' + icon + '" ' + '></img><span> ' + desc + '</span><br>');
  }
  createContextToolbarForUnfolding(halo, options, ctxThis) {
    let thisProcess = this;
    const cellModel = halo.options.cellView.model;
    if (cellModel.attributes.attrs.ellipse['stroke'] === '#0096FF') {
      ctxThis.remove();
      thisProcess.startProcessUnfolding(halo, options, null);
      return;
    }
    var popup = new joint.ui.Popup({
      events: {
        'click .btn-unfold': function() {
          popup.remove();
          let unfoldingOptions = {'Aggregation-Participation':this.$('.btn-c1')[0].checked,
                                  'Exhibition-Characterization-Attributes':this.$('.btn-c2')[0].checked,
                                  'Exhibition-Characterization-Operations':this.$('.btn-c3')[0].checked,
                                  'Generalization-Specialization':this.$('.btn-c4')[0].checked,
                                  'Classification-Instantiation':this.$('.btn-c5')[0].checked };
          thisProcess.startProcessUnfolding(halo, options, unfoldingOptions );

        },

      },
      content: [
        '<div>',
        '<input type="checkbox" name="structural"  class="btn-c1">' + this.createContentForUnfoldingOptions("StructuralAgg.png",     "Parts")           + '<br>',
        '<input type="checkbox" name="structural"  class="btn-c2">' + this.createContentForUnfoldingOptions("StructuralExhibit.png", "Attributes")      + '<br>',
        '<input type="checkbox" name="structural"  class="btn-c3">' + this.createContentForUnfoldingOptions("StructuralExhibit.png", "Operations")      + '<br>',
        '<input type="checkbox" name="structural"  class="btn-c4">' + this.createContentForUnfoldingOptions("StructuralGeneral.png", "Specializations") + '<br>',
        '<input type="checkbox" name="structural"  class="btn-c5">' + this.createContentForUnfoldingOptions("StructuralSpecify.png", "Instances")       + '<br>',
        '<center><button class="btn-unfold" style="text-align:center">Unfold</button></center>',
        '</div>'
      ].join(''),
      target: halo.el,
      padding: 30,
    });
    ctxThis.remove();
    popup.render();
  }
  startProcessUnfolding(halo, options, unfoldingOptions) {
    let clonedProcess;

    const cellModel = halo.options.cellView.model;
    console.log(cellModel.attributes.attrs.ellipse['stroke']);
    if (cellModel.attributes.attrs.ellipse['stroke'] === '#0096FF') {
      clonedProcess = options.opmModel.getVisualElementById(cellModel.id).refineeUnfolding;
      let pid = clonedProcess.id;
      options.graphService.changeGraphModel(pid, options.treeViewService, 'unfold');
    } else {
      let opd = new OpmOpd('');
      options.opmModel.addOpd(opd);
      cellModel.attributes.attrs.ellipse['stroke'] = '#0096FF';
      clonedProcess = options.treeViewService.insertNode(cellModel, 'unfold', options, unfoldingOptions );
      const elementlinks = options.graphService.graphLinks;
      processUnfolding(options, clonedProcess, unfoldingOptions);
      let visualElement = new OpmVisualProcess(clonedProcess.getParams(), null);
      options.opmModel.getLogicalElementByVisualId(cellModel.id).add(visualElement);
      visualElement.connectRefinementElements(cellModel.id, 'unfold');
      opd.add(visualElement);
    }
    options.treeViewService.treeView.treeModel.getNodeById(clonedProcess.id).toggleActivated();
    options.treeViewService.treeView.treeModel.getNodeById(clonedProcess.id).expand();
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
  updateFilter(newValue) {
    this.attr('ellipse', newValue);
  }
  getShapeFillColor() {
    return this.attr('ellipse/fill');
  }
  getShapeOutline() {
    return this.attr('ellipse/stroke');
  }
}

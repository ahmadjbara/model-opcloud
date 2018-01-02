import {OpmEntity} from './OpmEntity';
import { Essence, Affiliation } from '../ConfigurationOptions';
import {joint, _, paddingObject} from '../../configuration/rappidEnviromentFunctionality/shared';
import {OpmOpd} from "../OpmOpd";
import {OpmVisualProcess} from "../VisualPart/OpmVisualProcess";
// import {processUnfolding} from "../../configuration/elementsFunctionality/process-inzooming";
import {OpmObject} from "./OpmObject";
import {OpmProcess} from "./OpmProcess";
import {linkDrawing} from "../../configuration/elementsFunctionality/linkDrawing";
import {TriangleClass} from "./Links/OpmFundamentalLink";
import {ConsumptionLink} from "./Links/ConsumptionLink";
import {ResultLink} from "./Links/ResultLink";
import {OpmState} from "./OpmState";

export  class OpmThing extends OpmEntity {
  constructor() {
    super();
    this.set(this.thingAttributes());
    this.attr({text: {'font-weight': 600}});
    this.attr({value: {'value': 'None', 'valueType': 'None', 'units': ''}});
  }
  numberThing() {
    let thisText = this.attributes.attrs.text.text;
    if (this instanceof OpmProcess)
      thisText = String.fromCharCode(this.getCounter() + 64) + " " + thisText + 'ing';
    else
      thisText += " "+this.getCounter();
    this.attr({text: {text: thisText }});

  }

  thingShape() {
    return {
      filter: {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}},
      'stroke-dasharray': '0',
      width: 90,
      height: 50,
    };
  }
  thingAttributes() {
    return {
      minSize: {width: 90, height: 50},
      statesWidthPadding: 0,
      statesHeightPadding: 0,
    };
  }
  getThingParams() {
    const params = {
      essence: (this.getShapeAttr().filter.args.dx === 0) ? Essence.Informatical : Essence.Physical,
      affiliation: (this.getShapeAttr()['stroke-dasharray'] === '0') ? Affiliation.Systemic : Affiliation.Environmental,
    };
    return {...super.getEntityParams(), ...params};
  }
  updateThingFromOpmModel(visualElement) {
    const essenceArgs = visualElement.logicalElement.essence ? {dx: 0, dy: 0, blur: 0, color: 'grey'} : {dx: 3, dy: 3, blur: 0, color: 'grey'};
    const affiliation = visualElement.logicalElement.affiliation ? '10,5' : '0';
    return {
      filter: {name: 'dropShadow', args: essenceArgs},
      'stroke-dasharray': affiliation,
    };
  }
  // Function gets cell and update the default configuration in the all fields that embeded cells arrangement used.
  arrangeEmbededParams(refX, refY, alignX, alignY, arrangeState, stateWidthPadding, statesHeightPadding) {
    this.attr({text: {'ref-x': refX}});
    this.attr({text: {'ref-y': refY}});
    this.attr({text: {'x-alignment': alignX}});
    this.attr({text: {'y-alignment': alignY}});
    this.attr({'statesArrange': arrangeState});
    this.set('statesWidthPadding', stateWidthPadding);
    this.set('statesHeightPadding', statesHeightPadding);
  }
  // Function updateSizeToFitEmbeded Update the size of the object so that no embedded cell will exceed the father border with
  // padding of 10p.
  updateSizeToFitEmbeded() {
    let leftSideX = this.get('position').x;
    let topSideY = this.get('position').y;
    let rightSideX = this.get('position').x + this.get('size').width;
    let bottomSideY = this.get('position').y + this.get('size').height;

    _.each(this.getEmbeddedCells(), function(child) {
      const childBbox = child.getBBox();
      // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object
      if (childBbox.x <= (leftSideX + paddingObject)) { leftSideX = childBbox.x - paddingObject; }
      if (childBbox.y <= (topSideY + paddingObject)) { topSideY = childBbox.y - paddingObject; }
      if (childBbox.corner().x >= rightSideX - paddingObject) { rightSideX = childBbox.corner().x + paddingObject; }
      if (childBbox.corner().y >= bottomSideY - paddingObject) { bottomSideY = childBbox.corner().y + paddingObject; }
    });
    this.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }});
  }
  pointerUpHandle(cellView, options) {
    super.pointerUpHandle(cellView, options);
    const paper = cellView.paper;
    // When the dragged cell is dropped over another cell, let it become a child of the
    // element below.
    const cellViewsBelow = paper.findViewsFromPoint(this.getBBox().center());
    const currentCellId = this.id;
    if (cellViewsBelow.length) {
    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
    const cellViewBelow = _.find(cellViewsBelow, function (c) {
      return c.model.id !== currentCellId;
    });
    // Prevent recursive embedding.
    if (cellViewBelow && cellViewBelow.model.get('parent') !== currentCellId) {
      cellViewBelow.model.embed(this);
      /* Ahmad commented this line because it blocks the pointerdblclick event
         for the subprocesses of in-zoomed process. It was replaced by
         another line that roughly does the same functionality as toFront.
      */
      // cell.toFront();
      this.set('z', cellViewBelow.model.attributes.z  + 1);
      cellViewBelow.model.updateSizeToFitEmbeded();
    }
    }
  }
  haloConfiguration(halo, options) {
    super.haloConfiguration(halo, options);
    const thisThing = this;
    this.initializeHaloForComplexityManagement(halo, options);
  }
  initializeHaloForComplexityManagement(halo, options) {
    const thisProcess = this;
    halo.addHandle(this.addHandleGenerator('manage_complexity', 'sw', 'Click to manage complexity', 'left'));
    halo.on('action:manage_complexity:pointerdown', function (evt, x, y){
      if (options.treeViewService.treeView.treeModel.getNodeById(halo.options.cellView.model.id)!=null){
        let ct = thisProcess.createContextToolbar(['fitToContent', 'align'], ['Fit To Content', '<i>Align (to be added)</i>'], halo.el);
        console.log(ct);
        ct.on('action:fitToContent', function() {
          ct.remove();
          console.log(halo.options.cellView.model);
          if (halo.options.cellView.model instanceof  OpmProcess) {
            halo.options.cellView.model.fitEmbeds({padding: 40, cameFromFitEmbeds: true});
            halo.options.cellView.model.updateProcessSize();
          }
          else
            halo.options.cellView.model.fitEmbeds({padding: 30});
        });
        ct.render();
        return;
      }
      const contextToolbar = thisProcess.createContextToolbarForComplexityOpts(halo);
      const haloThis = this;
      contextToolbar.on('action:In-Zoom', function() {
        this.remove();
        let clonedProcess;
        const cellModel = haloThis.options.cellView.model;
        if (cellModel.attributes.attrs['stroke-width'] === 4) {
          clonedProcess = options.opmModel.getVisualElementById(cellModel.id).refineeInzooming;
          let pid = clonedProcess.id;
          options.graphService.changeGraphModel(pid, options.treeViewService, 'in-zoom');
        } else {
          let opd = new OpmOpd('');
          options.opmModel.addOpd(opd);
          cellModel.attributes.attrs['stroke-width'] = 4;
          clonedProcess = options.treeViewService.insertNode(cellModel, 'in-zoom', options);
          clonedProcess.set('position', {x: 350, y: 100});
          const elementlinks = options.graphService.graphLinks;
          let r;
          thisProcess.processInzooming(evt, 350, 100, haloThis.options, clonedProcess, elementlinks);
          let visualElement = new OpmVisualProcess(clonedProcess.getParams(), null);
          options.opmModel.getLogicalElementByVisualId(cellModel.id).add(visualElement);
          visualElement.connectRefinementElements(cellModel.id, 'in-zoom');
          opd.add(visualElement);
          opd.name = visualElement.id;
          opd.parendId = cellModel.get('id');
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
  createContentForUnfoldingOptions(icon, desc){
    return ( '<img width="25" height="20" src="../../../assets/icons/OPM_Links/' + icon + '" ' + '></img><span> ' + desc + '</span><br>');
  }

  // Generic function for ContextToolbar creation
  createContextToolbar(actions, contents, target) {
    let tools = [];
    actions.forEach((action, index) => {
      tools.push({action: action, content: contents[index]});
    });
    return new joint.ui.ContextToolbar({theme: 'modern', tools: tools, target: target, autoClose: true, padding: 30});
  }
  createContextToolbarForComplexityOpts(halo) {
    let isInZoomed = halo.options.cellView.model.attributes.attrs['stroke-width'] === 4 ? 'Show In-Zoomed' : 'In-Zoom';
    let isUnfolded = halo.options.cellView.model.attributes.attrs['stroke'] === '#0096FF' ? 'Show Unfolded' : 'Unfold';
    return this.createContextToolbar(['In-Zoom', 'Unfold'], [isInZoomed, isUnfolded], halo.el);
  }
  getConfigurationTools() {
    const thingToolsArray = [{ action: 'value', content: 'Computation' },
      { action: 'essenceAffiliation', content: '<img src=' + this.getImageEssenceAffiliation() + ' width="60" height="25">' }];
    return super.getConfigurationTools().concat(thingToolsArray);
  }
  configurationContextToolbarEvents(target, contextToolbar) {
    super.configurationContextToolbarEvents(target, contextToolbar);
    const thisThing = this;
    contextToolbar.on('action:value', function() {
      this.remove();
      thisThing.computation(target);
    });
    contextToolbar.on('action:essenceAffiliation', function() {
      this.remove();
      const imgPath = '../../../assets/icons/essenceAffil/';
      const essenceImg = imgPath + ((thisThing.getShapeAttr().filter.args.dx === 0) ? 'EssPhys.JPG' : 'EssInfo.JPG');
      const affiliationImg = imgPath + ((thisThing.getShapeAttr()['stroke-dasharray'] === '0') ? 'AffEnv.JPG' : 'AffSys.JPG');
      const tools = [{action: 'essenceChange', content: '<img src=' + essenceImg + ' width="80" height="35">'},
        {action: 'affiliationChange', content: '<img src=' + affiliationImg + ' width="80" height="35">'}];
      const essenceAffiliationToolbar = thisThing.contexToolbarGenerator(target, tools).render();
      essenceAffiliationToolbar.on('action:essenceChange', function () {
        thisThing.changeEssence();
        this.remove();
      });
      essenceAffiliationToolbar.on('action:affiliationChange', function () {
        thisThing.changeAffiliation();
        this.remove();
      });
    });
  }
  createContextToolbarForUnfolding(halo, options, ctxThis) {
    let thisProcess = this;
    const cellModel = halo.options.cellView.model;
    if (cellModel.attributes.attrs['stroke'] === '#0096FF') {
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
    if (cellModel.attributes.attrs['stroke'] === '#0096FF') {
      clonedProcess = options.opmModel.getVisualElementById(cellModel.id).refineeUnfolding;
      let pid = clonedProcess.id;
      options.graphService.changeGraphModel(pid, options.treeViewService, 'unfold');
    } else {
      let opd = new OpmOpd('');
      options.opmModel.addOpd(opd);
      cellModel.attributes.attrs['stroke'] = '#0096FF';
      clonedProcess = options.treeViewService.insertNode(cellModel, 'unfold', options, unfoldingOptions );
      const elementlinks = options.graphService.graphLinks;
      this.processUnfolding(options, clonedProcess, unfoldingOptions);
      let visualElement = new OpmVisualProcess(clonedProcess.getParams(), null);
      options.opmModel.getLogicalElementByVisualId(cellModel.id).add(visualElement);
      visualElement.connectRefinementElements(cellModel.id, 'unfold');
      opd.add(visualElement);
      opd.name = visualElement.id;
      opd.parendId = cellModel.get('id');
      this.addAllLevels(cellModel, clonedProcess, options, unfoldingOptions);
    }
    options.treeViewService.treeView.treeModel.getNodeById(clonedProcess.id).toggleActivated();
    options.treeViewService.treeView.treeModel.getNodeById(clonedProcess.id).expand();
  }
  addAllLevels(cellModel, clonedProcess, options, unfoldingOptions) {
    console.log(unfoldingOptions);
    let graph = options.graphService.graph;
    let triangles = graph.getConnectedLinks(clonedProcess, {outbound: true}).map(lnk => lnk.getTargetElement());
    let realLinks = triangles.map(tria => graph.getConnectedLinks(tria, {outbound: true}));
    let flattened =  realLinks.reduce((result, arr) => result.concat(arr), []);
    let leaves = flattened.map(lnk => lnk.getTargetElement());
    let thisThing = this;
    leaves.forEach(function(leaf) {
      if (leaf.cloneof === undefined)
        return;
      let outer = leaf.cloneof.attributes.id;
      options.treeViewService.treeView.treeModel.doForAll(function (node) {
        if (typeof node.data.graph.getCell(outer) !== 'undefined') {
          options.graphService.copyEmbeddedGraphElements(graph, outer, options.treeViewService, options, leaf);
          options.graphService.copyStructuralConnectedElementsTemp(node.data.graph, graph, outer, options, leaf, unfoldingOptions);
          thisThing.addAllLevels(leaf.cloneof, leaf, options, unfoldingOptions);
        }
      });
    });



  }
  getRightmostXCoord(cellRef, graph) {
    let x = 0;
    let links = graph.getConnectedLinks(cellRef, {outbound:true});
    if (typeof links === "undefined")
      return 0;

    for (let k = 0; k < links.length; k++) {
      if (links[k].getTargetElement() instanceof TriangleClass) {
        let lowerLinks = graph.getConnectedLinks(links[k].getTargetElement());
        x = lowerLinks.reduce((currentX, lnk) => Math.max(currentX, lnk.getTargetElement().getBBox().corner().x), x);
      } else {
        x = Math.max(x, links[k].getTargetElement().getBBox().corner().x);
      }
    }
    return x;
  }
}

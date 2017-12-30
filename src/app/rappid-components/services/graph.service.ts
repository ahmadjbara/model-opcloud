import { Injectable } from '@angular/core';
import { ModelObject } from './storage/model-object.class';
import { ModelStorageInterface } from './storage/model-storage.interface';
import {TreeViewService} from './tree-view.service';
import {linkDrawing} from '../../configuration/elementsFunctionality/linkDrawing';
import {OpmProcess} from '../../models/DrawnPart/OpmProcess';
import {OpmDefaultLink} from '../../models/DrawnPart/Links/OpmDefaultLink';
import {ResultLink} from '../../models/DrawnPart/Links/ResultLink';
import {OpmObject} from '../../models/DrawnPart/OpmObject';
import {OpmVisualObject} from '../../models/VisualPart/OpmVisualObject';
import {OpmState} from '../../models/DrawnPart/OpmState';
import {joint, _, vectorizer} from '../../configuration/rappidEnviromentFunctionality/shared';
import {InstrumentLink} from "../../models/DrawnPart/Links/InstrumentLink";
import {ConsumptionLink} from "../../models/DrawnPart/Links/ConsumptionLink";
import {compute} from "../../configuration/elementsFunctionality/computationalPart";
import {TriangleClass} from "../../models/DrawnPart/Links/OpmFundamentalLink";
import {ExhibitionLink} from "../../models/DrawnPart/Links/ExhibitionLink";
import {getRightmostXCoord} from '../../configuration/elementsFunctionality/process-inzooming';
import {AggregationLink} from "../../models/DrawnPart/Links/AggregationLink";
import {GeneralizationLink} from "../../models/DrawnPart/Links/GeneralizationLink";
import {InstantiationLink} from "../../models/DrawnPart/Links/InstantiationLink";
import {OpmLink} from "../../models/VisualPart/OpmLink";
import {OpmLinkRappid} from "../../models/DrawnPart/Links/OpmLinkRappid";
import {OpmEntity} from "../../models/DrawnPart/OpmEntity";
import {OpmVisualEntity} from "../../models/VisualPart/OpmVisualEntity";
import {createDrawnEntity, createDrawnLink} from "../../configuration/elementsFunctionality/graphFunctionality";
import {OpmProceduralRelation} from "../../models/LogicalPart/OpmProceduralRelation";
import {OpmProceduralLink} from "../../models/VisualPart/OpmProceduralLink";
import {OpmStructuralLink} from "../../models/VisualPart/OpmStructuralLink";
import {linkType} from "../../models/ConfigurationOptions";
import {arrangeEmbedded} from "../../configuration/elementsFunctionality/arrangeStates";

const rootId = 'SD';
const firebaseKeyEncode = require('firebase-key-encode');

@Injectable()
export class GraphService {
  graph;
  graphLinks;
  currentGraphId;
  modelObject;
  modelStorage;
  private JSON;
  private JSON_string;
  private modelToSync;
  // private OPL;
  // private modelName;
  type;


  constructor(modelStorage: ModelStorageInterface) {
    this.modelStorage = modelStorage;
    this.graph = new joint.dia.Graph;
    this.JSON = this.graph.toJSON();
    localStorage.setItem(rootId, JSON.stringify(this.graph.toJSON()));
    this.currentGraphId = rootId;
    this.type='';
    // this.initializeDatabase();
    // TODO: change:position emits on mousemove, find a better event - when drag stopped
    this.graph.on(`
                  remove`,
      () => this.updateJSON());

     this.modelObject = new ModelObject(null, null);
  }

  getGraph(name?: string) {

    return name ? this.loadGraph(name) : this.graph;
  }

  saveGraph(modelName, firstSave) {
    console.log('inside saveModel func')
    // TODO: work on this.graph.modelObject - might be JSON
    this.JSON = this.graph.toJSON();
    this.modelObject.saveModelParam(modelName, this.JSON);
    firebaseKeyEncode.deepEncode(this.modelObject.modelData);
    this.modelStorage.save(this.modelObject);
    if(firstSave)     //if saveAs and not only save
      this.modelStorage.listen(modelName, this.graph);
  }

  loadGraph(name) {
    this.modelStorage.get(name).then((res) => {
      this.modelObject = res;
      firebaseKeyEncode.deepDecode(this.modelObject.modelData);
      this.modelStorage.fromJson(this.graph, this.modelObject.modelData);
      this.modelStorage.listen(name, this.graph);
      //    this.graph.fromJSON(this.modelObject.modelData);
    });
  }

  updateJSON() {
    const modelInDb = this.modelStorage.models.includes(this.modelObject.name);
    if ((this.modelObject.name !== null) && modelInDb) {
      this.saveGraph(this.modelObject.name, false);
    } else {
      localStorage.setItem(this.modelObject.name, this.modelToSync);
    }
  }


  getGraphById(ElementId: string) {
    this.graph.fromJSON(JSON.parse(localStorage.getItem(ElementId)));
  }

  removeGraphById(ElementId: string, ParentId: string) {
     this.changeGraphModel(ParentId, null, null);
    localStorage.removeItem(ElementId);
  }

  graphSetUpdate(ElementId: string, newNodeRef, treeViewService, type, initRappid, unfoldingOptions) {

    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph = new joint.dia.Graph;
    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph.resetCells(this.graph.getCells());
    var newGraph = new joint.dia.Graph;
    let gCell=this.graph.getCell(ElementId);
    let clonedProcess = gCell.clone();
    clonedProcess.set('size', gCell.get('size'));
    clonedProcess.set('z', gCell.get('z'));
    clonedProcess.set('position',{x:350, y:100});
    clonedProcess.attributes.attrs.text.text = gCell.attributes.attrs.text.text;
    newGraph.addCell(clonedProcess);
    gCell.getEmbeddedCells().forEach(c => {
      if (c instanceof OpmState){
        let cs = c.clone();
        let newX = clonedProcess.get('position').x  + c.get('position').x - gCell.get('position').x;
        let newY = clonedProcess.get('position').y  + c.get('position').y - gCell.get('position').y;
        cs.set('position', {x: newX, y: newY});
        clonedProcess.embed(cs);
        newGraph.addCell(cs);
      }
      arrangeEmbedded(clonedProcess,"bottom");
    });
    if (type === 'unfold') {
      gCell.unfoldClone = clonedProcess;
      if (unfoldingOptions['Aggregation-Participation'] === true)
          this.copyEmbeddedGraphElements(newGraph, ElementId, treeViewService, initRappid, clonedProcess);

      this.copyStructuralConnectedElements(newGraph, ElementId, initRappid, clonedProcess, unfoldingOptions);
    }
    else {
      clonedProcess.remove();
      clonedProcess = this.copyConntectedGraphElements(newGraph, ElementId, initRappid);
      if (gCell instanceof OpmObject)
        this.copyStructuralObjectConnectedElements(newGraph, ElementId, initRappid, clonedProcess);
      gCell.inzoomClone = clonedProcess;
    }

    newNodeRef.graph = newGraph;
    this.graph.resetCells(newGraph.getCells());
    this.graph.getCells().map((cell) => cell.graph = this.graph);
    newNodeRef.id = clonedProcess.id;
    this.currentGraphId = newNodeRef.id;
    this.type = type;
    clonedProcess.cloneof = gCell;

    return clonedProcess;
  }
  private copyStructuralObjectConnectedElements(newGraph, elementId, initRappid, clonedProcess) {
    let gCell = this.graph.getCell(elementId);
    let pLinks = this.graph.getConnectedLinks(gCell);
    let thisGraph = this;

    pLinks = pLinks.filter(elm => (elm.getTargetElement() instanceof TriangleClass));

    pLinks.forEach(function (link, index) {
        let nLink;
        let triaLinks = thisGraph.graph.getConnectedLinks(link.getTargetElement(), {outbound: true});
        let eLink = link;
        triaLinks.forEach(function (link, index) {
          let clonedTarget = link.getTargetElement().clone();
          let pos = link.getTargetElement().get('position');
          clonedTarget.set('size', link.getTargetElement().get('size'));
          clonedTarget.set('position', pos);
          clonedTarget.attributes.attrs.text.text = link.getTargetElement().attributes.attrs.text.text;
          newGraph.addCells([clonedProcess, clonedTarget]);
          linkDrawing.drawLinkSilent(newGraph, eLink.attributes.OpmLinkType, clonedProcess, clonedTarget);
        });
      }
    );
  }
  private copyEmbeddedGraphElements(newGraph, elementID, treeViewService, initRappid, clonedProcess) {
    let gCell=this.graph.getCell(elementID);
    let embeddedCells;

    let clonedEmbeddedCells = [];
    if (typeof initRappid.opmModel.getVisualElementById(elementID).refineeInzooming !== 'undefined' ) {
      let pid = initRappid.opmModel.getVisualElementById(elementID).refineeInzooming.id;
      let tempGraph = treeViewService.getNodeByIdType(pid, 'in-zoom').graph;
      let embeddedIDs = tempGraph.getCell(pid).get('embeds');
      embeddedCells = embeddedIDs.map((e) => tempGraph.getCell(e));
      clonedEmbeddedCells = embeddedCells.map((c) => c.clone(), embeddedCells);
      for (let k=0; k< clonedEmbeddedCells.length; k++){
        clonedEmbeddedCells[k].cloneof = embeddedCells[k];
        embeddedCells[k].inzoomClone = clonedEmbeddedCells[k];
        clonedEmbeddedCells[k].attributes.attrs.text.text=embeddedCells[k].attributes.attrs.text.text;
      }
      newGraph.addCells(clonedEmbeddedCells);
    }
    else
      newGraph.addCell(clonedProcess);

    let w = clonedProcess.get('size').width;
    let h = clonedProcess.get('size').height;
    let x =  20;
    let y = clonedProcess.get('position').y;
    for (let k = 0; k < clonedEmbeddedCells.length; k++){
      clonedEmbeddedCells[k].set('position', {x:x, y:y+160});
      let typeName = 'Exhibition-Characterization';
      if ((clonedProcess instanceof OpmProcess && clonedEmbeddedCells[k] instanceof  OpmProcess) || (clonedProcess instanceof OpmObject && clonedEmbeddedCells[k] instanceof  OpmObject)) {
        typeName = 'Aggregation-Participation';
      }
      linkDrawing.drawLinkSilent(newGraph, typeName, clonedProcess, clonedEmbeddedCells[k]);
      x = x + clonedEmbeddedCells[k].get('size').width + 20;
    }
  }
  //star

  private isChecked(graph, link, unfoldingOptions){
    for (var prop in unfoldingOptions) {
      if (unfoldingOptions[prop] === true && prop.includes(link.attributes.name))
        if (prop.includes("Operations") ) {

          if (graph.getCell(link.attributes.target.id) instanceof OpmProcess)
            return true;
        }
        else
        if (prop.includes("Attributes")) {
          if (graph.getCell(link.attributes.target.id) instanceof OpmObject)
            return true;
        }
        else
          return true;
    }
    return false;
  }
  private copyStructuralConnectedElements(newGraph, elementId, initRappid, clonedProcess, unfoldingOptions){
    let gCell=this.graph.getCell(elementId);
    let pLinks=this.graph.getConnectedLinks(gCell);
    let thisGraph = this;

    let x = getRightmostXCoord(clonedProcess, newGraph) + 20;
    let y = clonedProcess.get('position').y;
    pLinks.forEach(function(link, index){
      if (! (link.getTargetElement() instanceof TriangleClass) )
        pLinks.splice(index,1);
      else {
        let nLink;

        let triaLinks = thisGraph.graph.getConnectedLinks(link.getTargetElement(), {outbound: true});
        let eLink = link;
        triaLinks.forEach(function (link, index) {
          if (thisGraph.isChecked(thisGraph.graph, link, unfoldingOptions)){
            let clonedTarget = link.getTargetElement().clone();
            let embeddedCells = link.getTargetElement().getEmbeddedCells();
            clonedTarget.set('size', link.getTargetElement().get('size'));
            clonedTarget.set('position', {x: x, y: y + 160})
            clonedTarget.attributes.attrs.text.text = link.getTargetElement().attributes.attrs.text.text;
            clonedTarget.cloneof = link.getTargetElement();
            link.getTargetElement().unfoldClone =  clonedTarget;
            newGraph.addCells([clonedProcess, clonedTarget]);
            linkDrawing.drawLinkSilent(newGraph, eLink.attributes.OpmLinkType, clonedProcess, clonedTarget);
            x = x + clonedTarget.get('size').width + 20;
            if (embeddedCells.length) {
              embeddedCells.forEach((c) => {
                let tmp = c.clone();
                tmp.cloneof = c;
                c.unfoldClone = tmp;
                tmp.set('size', c.get('size'));
                let newX = clonedTarget.get('position').x  + c.get('position').x - link.getTargetElement().get('position').x;
                let newY = clonedTarget.get('position').y  + c.get('position').y - link.getTargetElement().get('position').y;
                tmp.set('position', {x: newX, y: newY});
                clonedTarget.embed(tmp);
                newGraph.addCell(tmp);
              }, embeddedCells);
              clonedTarget.toFront({deep: true});
              console.log(clonedTarget.get('size'));
              console.log(link.getTargetElement().get('size'));
              arrangeEmbedded(clonedTarget, "bottom");
            }
          }
        });
      }
    });
  }
  private copyStructuralConnectedElementsTemp(graph, newGraph, elementId, initRappid, clonedProcess, unfoldingOptions){
    let gCell=graph.getCell(elementId);
    let pLinks=graph.getConnectedLinks(gCell);
    let thisGraph = this;
    let x = getRightmostXCoord(clonedProcess, newGraph) + 20;
    let y = clonedProcess.get('position').y;
    pLinks.forEach(function(link, index){
      if (! (graph.getCell(link.attributes.target.id) instanceof TriangleClass) )
        pLinks.splice(index,1);
      else {
        let nLink;
        let triaLinks = graph.getConnectedLinks(graph.getCell(link.attributes.target.id), {outbound: true});
        let eLink = link;
        triaLinks.forEach(function (link, index) {
          if (thisGraph.isChecked(graph, link, unfoldingOptions)) {
            let clonedTarget = graph.getCell(link.attributes.target.id).clone();
            let embeddedIDs = graph.getCell(link.attributes.target.id).get('embeds');
            let embeddedCells;
            if (typeof embeddedIDs != 'undefined')
              embeddedCells = embeddedIDs.map((e) => graph.getCell(e));
            clonedTarget.set('size', graph.getCell(link.attributes.target.id).get('size'));
            clonedTarget.set('position', {x: x, y: y + 160})
            clonedTarget.attributes.attrs.text.text = graph.getCell(link.attributes.target.id).attributes.attrs.text.text;
            clonedTarget.cloneof = graph.getCell(link.attributes.target.id);
            graph.getCell(link.attributes.target.id).unfoldClone = clonedTarget;
            graph.getCell(link.attributes.target.id).myClone = clonedTarget;
            newGraph.addCells([clonedProcess, clonedTarget]);
            linkDrawing.drawLinkSilent(newGraph, eLink.attributes.OpmLinkType, clonedProcess, clonedTarget);
            x = x + clonedTarget.get('size').width + 20;
            if (typeof embeddedIDs != 'undefined' && embeddedCells.length) {
              embeddedCells.forEach((c) => {
                let tmp = c.clone();
                tmp.cloneof = c;
                c.unfoldClone = tmp;
                tmp.set('size', c.get('size'));
                let newX = clonedTarget.get('position').x  + c.get('position').x - graph.getCell(link.attributes.target.id).get('position').x;
                let newY = clonedTarget.get('position').y  + c.get('position').y - graph.getCell(link.attributes.target.id).get('position').y;
                tmp.set('position', {x: newX, y: newY});
                clonedTarget.embed(tmp);
                newGraph.addCell(tmp);
              }, embeddedCells);
              clonedTarget.toFront({deep: true});
              arrangeEmbedded(clonedTarget, "bottom");
            }
          }
        });
      }
    });
  }
  private copyConntectedGraphElements(newGraph, elementId, initRappid) {
    let gCell=this.graph.getCell(elementId);
    let connctedCells=this.graph.getNeighbors(gCell);
    connctedCells = connctedCells.filter(elm => !(elm instanceof TriangleClass));
    /*connctedCells.forEach(function(elm, index){
     if (elm instanceof TriangleClass)
       connctedCells.splice(index,1);
    });*/
    connctedCells.push(gCell);
    let graphServiceThis = this;
    console.log(connctedCells);
    connctedCells.forEach(function(elm) {
      let parentId = elm.get('parent');
      if (parentId && elm instanceof OpmState) {
        connctedCells.push(graphServiceThis.graph.getCell(parentId));
      }
    });
    let temp = this.graph.cloneSubgraph(connctedCells,{deep:true});
    let clonedConnectedCells=[];
    for (let key in temp) {
      let cloned =  temp[key];
      let src = this.graph.getCell(key);
      cloned.cloneof = src;
      src.inzoomClone = cloned;
      cloned.set('position', src.get('position'));
      cloned.set('size', src.get('size'));
      cloned.set('z', src.get('z'));
      if (! (cloned instanceof OpmLinkRappid))
        cloned.attributes.attrs.text.text = src.attributes.attrs.text.text;
      clonedConnectedCells.push(temp[key]);
      if (temp[key] instanceof OpmObject) {
        let lg = initRappid.opmModel.getLogicalElementByVisualId(key);

        lg.add(new OpmVisualObject(temp[key].getParams(), lg));
      }
    }
    newGraph.addCells(clonedConnectedCells);
    return temp[elementId];
  }
  changeGraphModel(elementId, treeViewService, type) {
    if (elementId == this.currentGraphId && this.type === type)
      return 0;
    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph.resetCells(this.graph.getCells());

    this.graph.resetCells(treeViewService.getNodeByIdType(elementId, type).graph.getCells());
    this.currentGraphId = elementId;
    this.type = type;
  }
  execute(initRappid, linksArray) {
    // get all processes in the graph
    let graphProcesses = this.graph.get('cells').models.filter(element => element.get('type') === 'opm.Process');
    // sort processes from top to bottom
    graphProcesses = graphProcesses.sort((p1, p2) => p1.get('position').y - p2.get('position').y);
    // go over all processes
    for (let i = 0; i < graphProcesses.length; i++) {
      // if it is zn in-zoomed process then need to go to the in-zoomed graph and execute it first
      if (graphProcesses[i].attributes.attrs.ellipse['stroke-width'] === 4) {
        const inzoomedProcessId = initRappid.opmModel.getVisualElementById(graphProcesses[i].id).refineeInzooming.id;
        // change view to the in-zzomed graph
        this.changeGraphModel(inzoomedProcessId, initRappid.treeViewService, 'in-zoom');
        // recursive execution. now the in-zoomed graph will be executed
        this.execute(initRappid, linksArray);
        // change the view back to out-zoomed graph
        initRappid.changeGraphToParent(graphProcesses[0].id);
      } else {
        if (graphProcesses[i].attr('value/value') !== 'None') {
          compute(graphProcesses[i], initRappid.paper, linksArray, graphProcesses[0].id);
        }
      }
    }
  }
  showExecution(initRappid, linksArray, linkIndex) {
    if (linkIndex >= linksArray.length) return;
    initRappid.changeGraphToParent(linksArray[linkIndex].treeNodeId);
    const thisGraph = this;
    let currentLinkView;
    while (((linkIndex + 1) < linksArray.length) &&
          (linksArray[linkIndex].link.getTargetElement() === linksArray[linkIndex + 1].link.getTargetElement())) {
      const token2 = vectorizer.V('circle', {r: 5, fill: 'green', stroke: 'red'});
      currentLinkView = linksArray[linkIndex].link.findView(initRappid.paper);
      currentLinkView.sendToken(token2.node, 1000);
      linkIndex ++;
    }
    const token = vectorizer.V('circle', {r: 5, fill: 'green', stroke: 'red'});
    currentLinkView = linksArray[linkIndex].link.findView(initRappid.paper);
    currentLinkView.sendToken(token.node, 1000, function() {
      const targetElement = linksArray[linkIndex].link.getTargetElement();
      if (targetElement instanceof OpmObject) {
        const value = targetElement.get('logicalValue');
        if (value !== targetElement.attr('value/value')) {
          targetElement.attr({value: {value: value, valueType: 'Number'}});
        }
      }
      // run the token on the next link
      thisGraph.showExecution(initRappid, linksArray, ++linkIndex);
    });
  }
  createGraph(opd) {
    const graph = new joint.dia.Graph;
    let graphEntities = new Array();
    // first stage insert all entities
    for (let i = 0; i < opd.visualElements.length; i++) {
      // if it is an entity and it is not an embedded entity. needed for getting the right z value
      if ((opd.visualElements[i] instanceof OpmVisualEntity) && !(<OpmVisualEntity>opd.visualElements[i]).fatherObject) {
        const drawnElement = createDrawnEntity(opd.visualElements[i].logicalElement.name);
        drawnElement.updateParamsFromOpmModel(opd.visualElements[i]);
        graphEntities.push(drawnElement);
      }
    }
    graph.addCells(graphEntities);
    // second stage insert embedded entities
    graphEntities = [];
    for (let i = 0; i < opd.visualElements.length; i++) {
      // if it is an embedded entity
      if ((opd.visualElements[i] instanceof OpmVisualEntity) && (<OpmVisualEntity>opd.visualElements[i]).fatherObject) {
        const drawnElement = createDrawnEntity(opd.visualElements[i].logicalElement.name);
        drawnElement.updateParamsFromOpmModel(opd.visualElements[i]);
        graphEntities.push(drawnElement);
      }
    }
    graph.addCells(graphEntities);
    reEmbed(graph);
    // third stage insert all links
    for (let i = 0; i < opd.visualElements.length; i++) {
      if (opd.visualElements[i] instanceof OpmLink) {
        let sourceVisualElement, targetVisualElement, linkT, condition, event;
        // converting for getting the link type
        linkT = (<OpmProceduralRelation>(opd.visualElements[i].logicalElement)).linkType;
        if (opd.visualElements[i] instanceof OpmProceduralLink) {
          sourceVisualElement = (<OpmProceduralLink>(opd.visualElements[i])).sourceVisualElement;
          targetVisualElement = (<OpmProceduralLink>(opd.visualElements[i])).targetVisualElements[0].targetVisualElement;
          condition = (<OpmProceduralRelation>(opd.visualElements[i].logicalElement)).condition;
          event = (<OpmProceduralRelation>(opd.visualElements[i].logicalElement)).event;
        } else if (opd.visualElements[i] instanceof OpmStructuralLink) {
          sourceVisualElement = (<OpmStructuralLink>(opd.visualElements[i])).sourceVisualElement;
          targetVisualElement = (<OpmStructuralLink>(opd.visualElements[i])).targetVisualElements[0].targetVisualElement;
        }
        const sourceDrawnElement = graph.getCells().filter(element => (element.id === sourceVisualElement.id))[0];
        const targetDrawnElement = graph.getCells().filter(element => (element.id === targetVisualElement.id))[0];
        const drawnLink = createDrawnLink(sourceDrawnElement, targetDrawnElement, condition, event, linkType[linkT], graph);
        // UPDATE PARAMETERS OF LINK!!!!!!!!!!!!!!!
        graph.addCell(drawnLink);
      }
    }
    return graph;
  }
}
function reEmbed(graph) {
  for (let i = 0; i < graph.attributes.cells.models.length; i++) {
    const graphElements = graph.attributes.cells.models;
    if (graphElements[i] instanceof OpmEntity) {
      const parentObject = graphElements.filter(element => (element.id === graphElements[i].get('parent')))[0];
      if (parentObject) {
        parentObject.embed(graphElements[i]);
        if (parentObject instanceof OpmProcess) parentObject.set('padding', 100);
      }
    }
  }
}

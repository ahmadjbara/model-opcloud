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

  graphSetUpdate(ElementId: string, newNodeRef, treeViewService, type, initRappid) {

    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph = new joint.dia.Graph;
    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph.resetCells(this.graph.getCells());
    var newGraph = new joint.dia.Graph;
    let clonedProcess;
    if (type === 'unfold') {
      clonedProcess = this.copyEmbeddedGraphElements(newGraph, ElementId, treeViewService, initRappid);
    }
    else {
      clonedProcess = this.copyConntectedGraphElements(newGraph, ElementId, initRappid);
    }

    newNodeRef.graph = newGraph;
    this.graph.resetCells(newGraph.getCells());
    this.graph.getCells().map((cell) => cell.graph = this.graph);
    newNodeRef.id = clonedProcess.id;
    this.currentGraphId = newNodeRef.id;
    this.type = type;

    return clonedProcess;
  }

  private copyEmbeddedGraphElements(newGraph, elementID, treeViewService, initRappid) {
    let gCell=this.graph.getCell(elementID);
    let tmp = new joint.dia.Graph;
    let connctedCells;
    let clonedConnectedCells = [];
    let clonedProcess = gCell.clone();
    clonedProcess.set('position', {x: 350, y: 100});
    clonedProcess.attributes.attrs.ellipse['stroke'] = gCell.attributes.attrs.ellipse['stroke'];
    clonedProcess.attributes.attrs.ellipse['stroke-width'] = gCell.attributes.attrs.ellipse['stroke-width'];

    if (typeof initRappid.opmModel.getVisualElementById(elementID).refineeInzooming !== 'undefined' ) {
      let pid = initRappid.opmModel.getVisualElementById(elementID).refineeInzooming.id;
      let tempGraph = treeViewService.getNodeByIdType(pid, 'inzoom').graph;
      let embeds = tempGraph.getCell(pid).get('embeds');
      connctedCells = embeds.map((e) => tempGraph.getCell(e));
      // let connctedCells= tempGraph.getCell(pid).getEmbeddedCells({deep:true});



      clonedConnectedCells = connctedCells.map((c) => c.clone(), connctedCells);
      newGraph.addCells(clonedConnectedCells);
    }
    else
      newGraph.addCell(clonedProcess);

    let w = gCell.get('size').width;
    let h = gCell.get('size').height;
    let x =  20;
    let y = gCell.get('position').y+h;


    for (let k=0; k<clonedConnectedCells.length   ; k++){
      clonedConnectedCells[k].set('position', {x:x+(w+10)*k,y:y+150});
      let link = new OpmDefaultLink ();
      link.set({
        source: {id: clonedProcess.id},
        target: {id: clonedConnectedCells[k].id},
      });
      if (clonedConnectedCells[k] instanceof  OpmProcess) {
        link.attributes.name = 'Aggregation-Participation';
      }
      else{
        link.attributes.name = 'Exhibition-Characterization';
      }
      newGraph.addCells([clonedProcess, link, clonedConnectedCells[k]]);
      link.set('graph', newGraph);
      linkDrawing.drawLink(link, link.attributes.name);
    }
    let graphServiceThis = this;
    return clonedProcess;
   /* connctedCells.forEach(function(elm){
      let parentId = elm.get('parent');
      if (parentId) {
        newGraph.addCells(graphServiceThis.graph.getCell(parentId).getEmbeddedCells());
        newGraph.addCell(graphServiceThis.graph.getCell(parentId));
      }
    });*/
   // this.graphLinks = this.graph.getConnectedLinks(gCell);
  }
  //star

  private copyConntectedGraphElements(newGraph, elementId, initRappid) {
    let gCell=this.graph.getCell(elementId);
    let connctedCells=this.graph.getNeighbors(gCell);
    connctedCells.push(gCell);
    let graphServiceThis = this;
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
      cloned.set('position', src.get('position'));
      cloned.set('size', src.get('size'));
      cloned.set('z', src.get('z'));
      clonedConnectedCells.push(temp[key]);
      if (temp[key] instanceof OpmObject) {
        let lg = initRappid.opmModel.getLogicalElementByVisualId(key);
        lg.add(new OpmVisualObject(temp[key].getParams(), lg));
      }
    }
    newGraph.addCells(clonedConnectedCells);
    return temp[elementId];
   /*let graphServiceThis = this;
    clonedConnectedCells.forEach(function(elm){
      let parentId = elm.get('parent');
      if (parentId) {
        let temp = graphServiceThis.graph.getCell(parentId).getEmbeddedCells();
        let tmp = graphServiceThis.graph.cloneCells(temp);
        let newCells = [];
        for (let key in tmp)
          newCells.push(tmp[key]);
        newGraph.addCells(newCells);
        newGraph.addCell(graphServiceThis.graph.getCell(parentId));
      }
  });*/
    // this.graphLinks = this.graph.getConnectedLinks(gCell);
  }

  changeGraphModel(elementId, treeViewService, type) {
    if (elementId == this.currentGraphId && this.type === type)
      return 0;
    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph.resetCells(this.graph.getCells());

    this.graph.resetCells(treeViewService.getNodeByIdType(elementId, type).graph.getCells());
    this.currentGraphId = elementId;
    this.type = type;
  }
  execute(initRappid, linkViewsArray) {
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
        this.changeGraphModel(inzoomedProcessId, initRappid.treeViewService, 'inzoom');
        // recursive execution. now the in-zoomed graph will be executed
        this.execute(initRappid, linkViewsArray);
        // change the view back to out-zoomed graph
        this.changeGraphModel(graphProcesses[i].id, initRappid.treeViewService, 'inzoom');
      } else {
        const functionValue = graphProcesses[i].attr('value/value');
        if (functionValue !== 'None') {
          // get the inbound links
          let inbound = this.graph.getConnectedLinks(graphProcesses[i], {inbound: true});
          // get the outbound links
          let outbound = this.graph.getConnectedLinks(graphProcesses[i], {outbound: true});
          compute(inbound, outbound, initRappid.paper, functionValue, linkViewsArray);
        }
      }
    }
  }
  showExecution(initRappid, linkViewsArray, linkIndex) {
    if (linkIndex >= linkViewsArray.length) return;
    const token = vectorizer.V('circle', {r: 5, fill: 'green', stroke: 'red'});
    const thisGraph = this;
    linkViewsArray[linkIndex].sendToken(token.node, 1000, function() {
      const targetElement = linkViewsArray[linkIndex].model.getTargetElement();
      if (targetElement instanceof OpmObject) {
        const value = targetElement.get('logicalValue');
        if (value !== targetElement.attr('value/value')) {
          targetElement.attr({value: {value: value, valueType: 'Number'}});
        }
      }
      thisGraph.showExecution(initRappid, linkViewsArray, ++linkIndex);
    });
  }
}

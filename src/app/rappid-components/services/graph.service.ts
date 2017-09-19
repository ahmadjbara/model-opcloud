import { Injectable } from '@angular/core';
import { ModelObject } from '../../services/storage/model-object.class';
import { ModelStorageInterface } from '../../services/storage/model-storage.interface';
import {TreeViewService} from "../../services/tree-view.service";
import {linkDrawing} from  '../../link-operating/linkDrawing';
import {OpmProcess} from "../../models/OpmProcess";
const joint = require('rappid');
const rootId="SD";
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
      firebaseKeyEncode.deepDecode(this.modelObject.modelData)
      this.graph.fromJSON(this.modelObject.modelData);
    });
    this.modelStorage.listen(name, this.graph);
  }

  updateJSON() {
    const modelInDb = this.modelStorage.models.includes(this.modelObject.name);
    if ((this.modelObject.name !== null) && modelInDb) {
      this.saveGraph(this.modelObject.name, false);
    } else {
      localStorage.setItem(this.modelObject.name, this.modelToSync);
    }
  }


//   this.fireDB.ref('/models/' + this.modelName).on('value', function (snapshot) {
//   getModel(snapshot.val());
// });

/*

   this.graph.listen = function () {
   function getModel(model) {
   if (this.graph.myChangeLock) {
   //console.log('my change');
   this.graph.myChangeLock = false;
   return;
   }
   this.graph.JSON_string = model.graph;
   this.graph.JSON = JSON.parse(this.graph.JSON_string);
   this.graph.fromJSON(JSON.parse(this.graph.JSON_string));
   this.graph.OPL = model.opl;
   document.getElementById("opl").innerHTML = this.graph.OPL;
   };
   if (this.modelName !== 'undefined') {
   this.fireDB.ref('/models/' + this.modelName).on('value', function (snapshot) {
   getModel(snapshot.val());
   });
   }
   };
   _.bind(this.graph.listen, this.graph);
   this.graph.listen();
   }
*/

  getGraphById(ElementId: string) {
    this.graph.fromJSON(JSON.parse(localStorage.getItem(ElementId)));
  }

  removeGraphById(ElementId: string,ParentId: string) {
     this.changeGraphModel(ParentId, null, null);
    localStorage.removeItem(ElementId);
  }

  graphSetUpdate(ElementId: string, newNodeRef, treeViewService, type) {

    localStorage.setItem(this.currentGraphId, JSON.stringify(this.graph.toJSON()));
    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph = JSON.stringify(this.graph.toJSON());
    var newGraph = new joint.dia.Graph;
    if (type==='unfold') {
      this.copyEmbeddedGraphElements(newGraph, ElementId, treeViewService);
    }
    else
      this.copyConntectedGraphElements(newGraph,ElementId);
    newGraph=newGraph.toJSON();
    localStorage.setItem(ElementId, JSON.stringify(newGraph));
    newNodeRef.graph = JSON.stringify(newGraph);
    this.graph.fromJSON(newGraph);
    this.currentGraphId = ElementId;
    this.type=type;
  }

  private copyEmbeddedGraphElements(newGraph, elementID, treeViewService) {
    let gCell=this.graph.getCell(elementID);
    let tmp = new joint.dia.Graph;
    let connctedCells=tmp.fromJSON(JSON.parse(treeViewService.getNodeByIdType(elementID, 'inzoom').graph)).getCell(elementID).getEmbeddedCells({deep:true});
    newGraph.addCells(connctedCells);

    let w = gCell.get('size').width;
    let h = gCell.get('size').height;
    let x =  20;
    let y = gCell.get('position').y+h;


    for (let k=0; k<connctedCells.length   ; k++){
      connctedCells[k].set('position', {x:x+(w+10)*k,y:y+100});
      let link = new joint.shapes.opm.Link({source: {id:gCell.id}, target: {id:connctedCells[k].id}});
      if (connctedCells[k] instanceof  OpmProcess) {
        link.attributes.name = 'Aggregation-Participation';
      }
      else{
        link.attributes.name = 'Exhibition-Characterization';
      }
      newGraph.addCells([gCell, link, connctedCells[k]]);
      link.set('graph', newGraph);
      linkDrawing.drawLink(link, link.attributes.name);
    }
    let graphServiceThis = this;
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

  private copyConntectedGraphElements(newGraph, elementId) {
    let gCell=this.graph.getCell(elementId);
    let connctedCells=this.graph.getNeighbors(gCell);
    newGraph.addCells(connctedCells);
    let graphServiceThis = this;
    connctedCells.forEach(function(elm){
      let parentId = elm.get('parent');
      if (parentId) {
        newGraph.addCells(graphServiceThis.graph.getCell(parentId).getEmbeddedCells());
        newGraph.addCell(graphServiceThis.graph.getCell(parentId));
      }
  });
    this.graphLinks = this.graph.getConnectedLinks(gCell);
  }

  changeGraphModel(elementId, treeViewService, type) {
    if (elementId == this.currentGraphId && this.type===type)
      return 0;
    //localStorage.setItem(this.currentGraphId, JSON.stringify(this.graph.toJSON()));
    treeViewService.getNodeByIdType(this.currentGraphId, this.type).graph = JSON.stringify(this.graph.toJSON());

    console.log(treeViewService.getNodeByIdType(elementId, type));
    this.graph.fromJSON(JSON.parse(treeViewService.getNodeByIdType(elementId, type).graph));
    //this.graph.fromJSON(JSON.parse(localStorage.getItem(elementId)));
    this.currentGraphId = elementId;
    this.type = type;
  }
}

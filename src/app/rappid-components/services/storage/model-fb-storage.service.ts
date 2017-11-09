import { Injectable, Inject } from '@angular/core';
import { ModelStorageInterface } from './model-storage.interface';
import { ModelObject } from './model-object.class';
import { FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';
import {OpmObject} from "../../../models/DrawnPart/OpmObject";
import {OpmProcess} from "../../../models/DrawnPart/OpmProcess";
import {OpmState} from "../../../models/DrawnPart/OpmState";
const firebaseKeyEncode = require('firebase-key-encode');

@Injectable()
export class ModelFbStorageService extends ModelStorageInterface {
  models = [];
  fbModels;
  fbCurrentModel: FirebaseObjectObservable<any>;

  constructor(private af: AngularFireDatabase) {
    super();
    this.fbModels = af.object('/modelnames');
  }

  get(modelName: string): any {
    let ref = this.af.database.ref(`/models/${modelName}`);
    return ref.once('value')
      .then((snapshot) => {
        return new ModelObject(modelName, snapshot.val());
      });
  }

  listen(modelName: string, graph): any {
    let ref = this.af.database.ref(`/models/${modelName}`);
    const fbThis = this;
    ref.on('value', function (snapshot) {
      let json = snapshot.val();
      if (json) {
        firebaseKeyEncode.deepDecode(json);
        fbThis.fromJson(graph, json);
        //graph.fromJSON(json);
      }
    });
  }
  fromJson(graph, json) {
    if (graph.attributes.cells.models.length > 0) {
      for (let i = 0; i < graph.attributes.cells.models.length; i++) {
        const elementId = graph.attributes.cells.models[i].get('id');
        const jsonCell = json.cells.filter(element => (element.id === elementId));
        graph.attributes.cells.models[i].set(jsonCell[0]);
      }
    } else {
      const graphElements = new Array();
      for (let i = 0; i < json.cells.length; i++) {
        const newCell = this.createNewGraphElement(json.cells[i]);
        newCell.attributes = json.cells[i];
        newCell.set('id', json.cells[i].id);
        graphElements.push(newCell);
      }
      graph.addCells(graphElements);
    }
  }
  createNewGraphElement(jsonCell) {
    if (jsonCell.type === 'opm.Object') {
      return new OpmObject();
    } else if (jsonCell.type === 'opm.Process') {
      return new OpmProcess();
    } else if (jsonCell.type === 'opm.State') {
      return new OpmState();
    }
  }

  getAndListen(modelName: string, graph): any {
    var newValue = this.get(modelName);
    this.listen(modelName, graph);
    return newValue;
  }

  save(modelObject: ModelObject): any {
    this.fbModels.update({ [modelObject.name]: true });
    this.fbCurrentModel = this.af.object(`/models/${modelObject.name}`);
    this.fbCurrentModel.set(modelObject.modelData);
  }

  getModels(): any {
    let ref = this.af.database.ref('/modelnames');
    return ref.once('value')
      .then((snapshot) => {
        return this.models = Object.keys(snapshot.val());
      });
  }

  deleteModel(modelName) : any {
    this.af.database.ref(`/models/${modelName}`).remove();
    this.af.database.ref(`/modelnames/${modelName}`).remove();
  }
}

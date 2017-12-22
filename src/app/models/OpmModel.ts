import {OpmLogicalElement} from './LogicalPart/OpmLogicalElement';
import {OpmVisualElement} from './VisualPart/OpmVisualElement';
import {OpmOpd} from './OpmOpd';
import {OpmLogicalObject} from "./LogicalPart/OpmLogicalObject";
import {OpmLogicalProcess} from "./LogicalPart/OpmLogicalProcess";
import {OpmLogicalState} from "./LogicalPart/OpmLogicalState";
import {OpmProceduralRelation} from "./LogicalPart/OpmProceduralRelation";
import {OpmTaggedRelation} from "./LogicalPart/OpmTaggedRelation";
import {OpmFundamentalRelation} from "./LogicalPart/OpmFundamentalRelation";
import {OpmVisualObject} from "./VisualPart/OpmVisualObject";
import {OpmTaggedLink} from "./VisualPart/OpmTaggedLink";
import {OpmVisualProcess} from "./VisualPart/OpmVisualProcess";
import {OpmVisualState} from "./VisualPart/OpmVisualState";
import {OpmProceduralLink} from "./VisualPart/OpmProceduralLink";
import {OpmFundamentalLink} from "./VisualPart/OpmFundamentalLink";
import {OpmRelation} from "./LogicalPart/OpmRelation";

export class OpmModel {
  private name: string;
  private description: string;
  logicalElements: Array<OpmLogicalElement<OpmVisualElement>>;
  opds: Array<OpmOpd>;
  currentOpd: OpmOpd;

  constructor() {
    this.logicalElements = new Array<OpmLogicalElement<OpmVisualElement>>();
    this.opds = new Array<OpmOpd>();
    this.currentOpd = new OpmOpd('SD');
    this.opds.push(this.currentOpd);
  }
  addOpd(opd: OpmOpd) {
    this.opds.push(opd);
    this.currentOpd = opd;
  }
  add(opmLogicalElement: OpmLogicalElement<OpmVisualElement>) {
    this.logicalElements.push(opmLogicalElement);
  }
  remove(opmVisualElementId) {
    const logicalElement = this.getLogicalElementByVisualId(opmVisualElementId);
    if (logicalElement) {
      logicalElement.remove(opmVisualElementId);
      if (logicalElement.visualElements.length === 0) {
        this.removeLogicalElement(logicalElement);
      }
    }
  }
  removeLogicalElement(opmLogicalElement) {
    for (let i = 0; i < this.logicalElements.length; i++) {
      if (this.logicalElements[i] === opmLogicalElement) {
        this.logicalElements.splice(i, 1);
        break;
      }
    }
  }
  getVisualElementById(visualID) {
    for (let i = 0; i < this.logicalElements.length; i++) {
      for (let j = 0; j < this.logicalElements[i].visualElements.length; j++)
        if (visualID === this.logicalElements[i].visualElements[j].id)
          return this.logicalElements[i].visualElements[j];
    }
    return null;
  }
  getLogicalElementByVisualId(visualID) {
    for (let i = 0; i < this.logicalElements.length; i++) {
      for (let j = 0; j < this.logicalElements[i].visualElements.length; j++)
        if (visualID === this.logicalElements[i].visualElements[j].id)
          return this.logicalElements[i];
    }
    return null;
  }
  toJson() {
    const jsonOpmModel = new OpmModel();
    jsonOpmModel.name = this.name;
    jsonOpmModel.description = this.description;
    for (let i = 0; i < this.logicalElements.length; i++) {
      let jsonLogicalElement;
      if (this.logicalElements[i] instanceof OpmLogicalObject) {
        jsonLogicalElement = (<OpmLogicalObject>this.logicalElements[i]).getParams();
      } else if (this.logicalElements[i] instanceof OpmLogicalProcess) {
        jsonLogicalElement = (<OpmLogicalProcess>this.logicalElements[i]).getParams();
      } else if (this.logicalElements[i] instanceof OpmLogicalState) {
        jsonLogicalElement = (<OpmLogicalState>this.logicalElements[i]).getParams();
      } else if (this.logicalElements[i] instanceof OpmTaggedRelation) {
        jsonLogicalElement = (<OpmTaggedRelation>this.logicalElements[i]).getParams();
      } else if (this.logicalElements[i] instanceof OpmFundamentalRelation) {
        jsonLogicalElement = (<OpmFundamentalRelation>this.logicalElements[i]).getParams();
      } else if (this.logicalElements[i] instanceof OpmProceduralRelation) {
        jsonLogicalElement = (<OpmProceduralRelation>this.logicalElements[i]).getParams();
      }
      jsonOpmModel.logicalElements.push(jsonLogicalElement);
    }
    let elementIds = new Array();
    for (let i = 0; i < this.currentOpd.visualElements.length; i++) {
      elementIds.push(this.currentOpd.visualElements[i].id);
    }
    jsonOpmModel.currentOpd.name = this.currentOpd.name;
    jsonOpmModel.currentOpd.visualElements = elementIds;
    const opds = new Array<OpmOpd>();
    for (let i = 0; i < this.opds.length; i++) {
      elementIds = [];
      for (let j = 0; j < this.opds[i].visualElements.length; j++) {
        elementIds.push(this.opds[i].visualElements[j].id);
      }
      const opd  = new OpmOpd(this.opds[i].name);
      opd.visualElements = elementIds;
      opds.push(opd);
    }
    jsonOpmModel.opds = opds;
    const jsonModel = JSON.stringify(jsonOpmModel);
    return jsonModel;
  }
  fromJson(jsonString) {
    const opmModelJson = JSON.parse(jsonString);
    const opmModel = new OpmModel();
    // restore changed fields
    for (let i = 0; i < opmModelJson.logicalElements.length; i++) {
      opmModel.logicalElements.push(opmModel.createNewOpmModelElement(opmModelJson.logicalElements[i], opmModel));
    }
    // in case link's source or target elements weren't restored yet when the link
    // was restored, we go over the links and update source and target elements
    for (let i = 0; i < opmModel.logicalElements.length; i++) {
      if (opmModel.logicalElements[i] instanceof OpmRelation) {
        opmModel.logicalElements[i].updateSourceAndTargetFromJson();
      } else if (opmModel.logicalElements[i] instanceof OpmLogicalProcess) {
        for (let j = 0; j < opmModel.logicalElements[i].visualElements.length; j++) {
          opmModel.logicalElements[i].visualElements[j].updateComplexityReferences();
        }
      }
    }
    opmModel.currentOpd = opmModel.createOpdFromJson(opmModelJson.currentOpd, opmModel);
    const opds = new Array<OpmOpd>();
    for (let i = 0; i < opmModelJson.opds.length; i++) {
      opds.push(opmModel.createOpdFromJson(opmModelJson.opds[i], opmModel));
    }
    opmModel.opds = opds;
    opmModel.name = opmModelJson.name;
    opmModel.description = opmModelJson.description;
    return opmModel;
  }
  createOpdFromJson(jsonOpd, opmModel) {
    const opd  = new OpmOpd(jsonOpd.name);
    for (let i = 0; i < jsonOpd.visualElements.length; i++) {
      opd.add(opmModel.getVisualElementById(jsonOpd.visualElements[i]));
    }
    return opd;
  }
  createNewOpmModelElement(jsonElement, opmModel) {
    const pseudoLogical = opmModel.createNewLogicalElement(jsonElement.name, null, opmModel);
    const pseudoVisual = opmModel.createNewVisualElement(jsonElement.name, null, pseudoLogical);
    let paramsLogical, paramsVisual;
    let logicalElement;
    paramsLogical = pseudoLogical.getParamsFromJsonElement(jsonElement);
    paramsVisual = pseudoVisual.getParamsFromJsonElement(jsonElement.visualElementsParams[0]);
    logicalElement = this.createNewLogicalElement(jsonElement.name, {...paramsLogical, ...paramsVisual}, opmModel);
    for (let i = 1; i < jsonElement.visualElementsParams.length; i++) {
      paramsVisual = pseudoVisual.getParamsFromJsonElement(jsonElement.visualElementsParams[i]);
      logicalElement.add(this.createNewVisualElement(jsonElement.name, paramsVisual, logicalElement));
    }
    return logicalElement;
  }
  createNewLogicalElement(elementType, params, opmModel) {
    switch (elementType) {
      case 'OpmLogicalObject':
        return new OpmLogicalObject(params, opmModel);
      case 'OpmLogicalProcess':
        return new OpmLogicalProcess(params, opmModel);
      case 'OpmLogicalState':
        return new OpmLogicalState(params, opmModel);
      case 'OpmProceduralRelation':
        return new OpmProceduralRelation(params, opmModel);
      case 'OpmFundamentalRelation':
        return new OpmFundamentalRelation(params, opmModel);
      case 'OpmTaggedRelation':
        return new OpmTaggedRelation(params, opmModel);
    }
  }
  createNewVisualElement(elementLogicalType, params, logicalElement) {
    switch (elementLogicalType) {
      case 'OpmLogicalObject':
        return new OpmVisualObject(params, logicalElement);
      case 'OpmLogicalProcess':
        return new OpmVisualProcess(params, logicalElement);
      case 'OpmLogicalState':
        return new OpmVisualState(params, logicalElement);
      case 'OpmProceduralRelation':
        return new OpmProceduralLink(params, logicalElement);
      case 'OpmFundamentalRelation':
        return new OpmFundamentalLink(params, logicalElement);
      case 'OpmTaggedRelation':
        return new OpmTaggedLink(params, logicalElement);
    }
  }
}

import {OpmVisualElement} from './VisualPart/OpmVisualElement';
import {joint} from '../configuration/rappidEnviromentFunctionality/shared';
import {createDrawnElement, createDrawnEntity} from "../configuration/elementsFunctionality/graphFunctionality";
import {OpmVisualEntity} from "./VisualPart/OpmVisualEntity";

export class OpmOpd {
  visualElements: Array<OpmVisualElement>;
  name: string;

  constructor(name) {
    this.visualElements = new Array<OpmVisualElement>();
    this.name = name;
  }
  add(visualElement: OpmVisualElement) {
    this.visualElements.push(visualElement);
  }
  remove(opmVisualElementId) {
    for (let i = 0; i < this.visualElements.length; i++) {
      if (this.visualElements[i].id === opmVisualElementId) {
        this.visualElements.splice(i, 1);
        break;
      }
    }
  }
  createOpdFromJson(jsonOpd, opmModel) {
    for (let i = 0; i < jsonOpd.visualElements.length; i++) {
      this.add(opmModel.getVisualElementById(jsonOpd.visualElements[i]));
    }
  }
  createGraph() {
    const graph = new joint.dia.Graph;
    const graphElements = new Array();
    for (let i = 0; i < this.visualElements.length; i++) {
      if (this.visualElements[i] instanceof OpmVisualEntity) {
        const drawnElement = createDrawnEntity(this.visualElements[i].logicalElement.name);
        drawnElement.updateParamsFromOpmModel(this.visualElements[i]);
        graphElements.push(drawnElement);
      }
    }
    graph.addCells(graphElements);
    return graph;
  }
}

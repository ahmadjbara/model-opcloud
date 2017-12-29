import {OpmVisualElement} from './VisualPart/OpmVisualElement';
import {joint} from '../configuration/rappidEnviromentFunctionality/shared';
import {createDrawnEntity, createDrawnLink} from "../configuration/elementsFunctionality/graphFunctionality";
import {OpmVisualEntity} from "./VisualPart/OpmVisualEntity";
import {OpmProceduralRelation} from "./LogicalPart/OpmProceduralRelation";
import {OpmLink} from "./VisualPart/OpmLink";
import {OpmProceduralLink} from "./VisualPart/OpmProceduralLink";
import {OpmStructuralLink} from "./VisualPart/OpmStructuralLink";
import {linkType} from "./ConfigurationOptions";
import {OpmState} from "./DrawnPart/OpmState";
import {OpmEntity} from "./DrawnPart/OpmEntity";

export class OpmOpd {
  visualElements: Array<OpmVisualElement>;
  name: string;
  parendId: string;

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
    const graphEntities = new Array();
    // first stage insert all entities
    for (let i = 0; i < this.visualElements.length; i++) {
      if (this.visualElements[i] instanceof OpmVisualEntity) {
        const drawnElement = createDrawnEntity(this.visualElements[i].logicalElement.name);
        drawnElement.updateParamsFromOpmModel(this.visualElements[i]);
        graphEntities.push(drawnElement);
      }
    }
    graph.addCells(graphEntities);
    // second stage insert all link
    for (let i = 0; i < this.visualElements.length; i++) {
      if (this.visualElements[i] instanceof OpmLink) {
        let sourceVisualElement, targetVisualElement, linkT, condition, event;
        // converting for getting the link type
        linkT = (<OpmProceduralRelation>(this.visualElements[i].logicalElement)).linkType;
        if (this.visualElements[i] instanceof OpmProceduralLink) {
          sourceVisualElement = (<OpmProceduralLink>(this.visualElements[i])).sourceVisualElement;
          targetVisualElement = (<OpmProceduralLink>(this.visualElements[i])).targetVisualElements[0].targetVisualElement;
          condition = (<OpmProceduralRelation>(this.visualElements[i].logicalElement)).condition;
          event = (<OpmProceduralRelation>(this.visualElements[i].logicalElement)).event;
        } else if (this.visualElements[i] instanceof OpmStructuralLink) {
          sourceVisualElement = (<OpmStructuralLink>(this.visualElements[i])).sourceVisualElement;
          targetVisualElement = (<OpmStructuralLink>(this.visualElements[i])).targetVisualElements[0].targetVisualElement;
        }
        const sourceDrawnElement = graphEntities.filter(element => (element.id === sourceVisualElement.id))[0];
        const targetDrawnElement = graphEntities.filter(element => (element.id === targetVisualElement.id))[0];
        const drawnLink = createDrawnLink(sourceDrawnElement, targetDrawnElement, condition, event, linkType[linkT], graph);
        // UPDATE PARAMETERS OF LINK!!!!!!!!!!!!!!!
        graph.addCell(drawnLink);
      }
    }
    reEmbed(graph);
    return graph;
  }
}
function reEmbed(graph) {
  for (let i = 0; i < graph.attributes.cells.models.length; i++) {
    const graphElements = graph.attributes.cells.models;
    if (graphElements[i] instanceof OpmEntity) {
      const parentObject = graphElements.filter(element => (element.id === graphElements[i].get('parent')))[0];
      if (parentObject) parentObject.embed(graphElements[i]);
    }
  }
}

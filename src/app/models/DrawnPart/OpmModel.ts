
import {OpmLogicalElement} from "../LogicalPart/OpmLogicalElement";
import {OpmVisualElement} from "../VisualPart/OpmVisualElement";
import {OpmOpd} from "./OpmOpd";
import {OpmLogicalState} from "../LogicalPart/OpmLogicalState";

export class OpmModel {
  private name: string;
  private description: string;
  logicalElements: Array<OpmLogicalElement<OpmVisualElement>>;
  opds: Array<OpmOpd>;

  constructor() {
    this.logicalElements = new Array<OpmLogicalElement<OpmVisualElement>>();
  }
  add(opmLogicalElement: OpmLogicalElement<OpmVisualElement>) {
    opmLogicalElement.opmModel = this;
    this.logicalElements.push(opmLogicalElement);
  }
  getVisualElementById(visualID){
    for (let i=0; i<this.logicalElements.length; i++){
      for (let j=0; j < this.logicalElements[i].visualElements.length; j++)
        if (visualID === this.logicalElements[i].visualElements[j].id)
          return this.logicalElements[i].visualElements[j];
    }
    return null;
  }
}

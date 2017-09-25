
import {OpmLogicalElement} from "./LogicalPart/OpmLogicalElement";
import {OpmVisualElement} from "./VisualPart/OpmVisualElement";
import {OpmOpd} from "./OpmOpd";

export class OpmModel {
  private name: string;
  private description: string;
  logicalElements: Array<OpmLogicalElement<OpmVisualElement>>;
  opds: Array<OpmOpd>;

  constructor(){
    this.logicalElements = new Array<OpmLogicalElement<OpmVisualElement>>();
  }
  add(opmLogicalElement: OpmLogicalElement<OpmVisualElement>) {
    this.logicalElements.push(opmLogicalElement);
  }
}


import {OpmLogicalElement} from "./LogicalPart/OpmLogicalElement";
import {OpmVisualElement} from "./VisualPart/OpmVisualElement";
import {OpmOpd} from "./OpmOpd";

export class OpmModel {
  logicalElements: Array<OpmLogicalElement<OpmVisualElement>>;
  opds: Array<OpmOpd>;
}

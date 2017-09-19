
  import {OpmVisualElement} from "../VisualPart/OpmVisualElement";

  export class OpmLogicalElement<T extends OpmVisualElement> {
    visualElements: Array<T>;
    text: string;
  }


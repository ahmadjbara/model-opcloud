import {OpmVisualElement} from "../VisualPart/OpmVisualElement";

export class OpmOpd {
  visualElements: Array<OpmVisualElement>;
  name: string;

  constructor(name){
    this.visualElements = new Array<OpmVisualElement>();
    this.name = name;
  }
  add(visualElement: OpmVisualElement) {
    this.visualElements.push(visualElement);
  }

}

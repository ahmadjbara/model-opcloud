import {OpmVisualElement} from './VisualPart/OpmVisualElement';

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
}

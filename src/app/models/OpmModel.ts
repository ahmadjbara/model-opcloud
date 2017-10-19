import {OpmLogicalElement} from './LogicalPart/OpmLogicalElement';
import {OpmVisualElement} from './VisualPart/OpmVisualElement';
import {OpmOpd} from './OpmOpd';

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
}

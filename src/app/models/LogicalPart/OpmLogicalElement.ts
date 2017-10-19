
  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import {OpmModel} from "../OpmModel";

  export abstract class OpmLogicalElement<T extends OpmVisualElement> {
    static objectText = 'Object';
    static processText = 'Process';
    static stateText = 'State';
    visualElements: Array<T>;
    opmModel: OpmModel;
    constructor(model) {
      this.opmModel = model;
      this.visualElements = new Array<T>();
    }
    add(opmVisualElement) {
      this.visualElements.push(opmVisualElement);
      opmVisualElement.pointToFather(this);
      this.opmModel.currentOpd.add(opmVisualElement);
    }
    remove(opmVisualElementId) {
      for (let i = 0; i < this.visualElements.length; i++) {
        if (this.visualElements[i].id === opmVisualElementId) {
          this.visualElements.splice(i, 1);
          this.opmModel.currentOpd.remove(opmVisualElementId);
          break;
        }
      }
    }
    findVisualElement(id){
      for (let k=0; k<this.visualElements.length; k++)
        if (this.visualElements[k].id === id)
          return this.visualElements[k];
      return null;
    }
  }



  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import {OpmModel} from "../DrawnPart/OpmModel";

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
    }
  }



  import {OpmVisualElement} from '../VisualPart/OpmVisualElement';
  import {OpmModel} from "../OpmModel";

  export abstract class OpmLogicalElement<T extends OpmVisualElement> {
    static objectText = 'Object';
    static processText = 'Process';
    static stateText = 'State';
    visualElements: Array<T>;
    opmModel: OpmModel;
  }


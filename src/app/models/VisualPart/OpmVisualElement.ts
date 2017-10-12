import {OpmLogicalElement} from '../LogicalPart/OpmLogicalElement';

export class OpmVisualElement {
    logicalElement: OpmLogicalElement<OpmVisualElement>;
    textColor: string;
    textFontSize: number;
    textFontFamily: string;
    strokeWidth: number;
    strokeColor: string;
    textFontWeight: number;
    id: string;
    constructor(params, logicalElement) {
      this.logicalElement = logicalElement;
      this.textColor = params.textColor;
      this.textFontSize = params.textFontSize;
      this.textFontFamily = params.textFontFamily;
      this.textFontWeight = params.textFontWeight;
      this.strokeWidth = params.strokeWidth;
      this.strokeColor = params.fill;
      this.id = params.id;
    }
}


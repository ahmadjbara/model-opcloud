import {OpmLogicalElement} from '../LogicalPart/OpmLogicalElement';

export class OpmVisualElement {
    logicalElement: OpmLogicalElement<OpmVisualElement>;
    textColor: string;
    textFontSize: number;
    textFontFamily: string;
    strokeWidth: number;
    id: string;
    constructor(params) {
      this.textColor = params.textColor;
      this.textFontSize = params.textFontSize;
      this.textFontFamily = params.textFontFamily;
      this.strokeWidth = params.strokeWidth;
      this.id = params.id;
    }
  }


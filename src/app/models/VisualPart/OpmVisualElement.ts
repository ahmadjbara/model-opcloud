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
      if (params) this.updateParams(params);
    }
    pointToFather(opmLogicalElement) {
      this.logicalElement = opmLogicalElement;
    }
    getElementParams() {
      return {
        textFontWeight: this.textFontWeight,
        textFontSize: this.textFontSize,
        textFontFamily: this.textFontFamily,
        textColor: this.textColor,
        strokeWidth: this.strokeWidth,
        strokeColor: this.strokeColor,
        id: this.id
      };
    }
    updateParams(params) {
      this.textColor = params.textColor;
      this.textFontSize = params.textFontSize;
      this.textFontFamily = params.textFontFamily;
      this.textFontWeight = params.textFontWeight;
      this.strokeColor = params.strokeColor;
      this.id = params.id;
    }
    getElementParamsFromJsonElement(jsonElement) {
      return {
        textColor: jsonElement.textColor,
        textFontSize: jsonElement.textFontSize,
        textFontFamily: jsonElement.textFontFamily,
        textFontWeight: jsonElement.textFontWeight,
        strokeColor: jsonElement.strokeColor,
        id: jsonElement.id
      };
    }
  updateComplexityReferences() {}
}


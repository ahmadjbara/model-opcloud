  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmVisualEntity extends OpmVisualElement {
    fill: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;

    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    getEntityParams() {
      const params =  {
        xPos: this.xPos,
        yPos: this.yPos,
        width: this.width,
        height: this.height,
        fill: this.fill,
      };
      return {...super.getElementParams(), ...params};
    }
    updateParams(params) {
      super.updateParams(params);
      this.fill = params.fill;
      this.xPos = params.xPos;
      this.yPos = params.yPos;
      this.width = params.width;
      this.height = params.height;
    }
    getEntityParamsFromJsonElement(jsonElement) {
      const params =  {
        fill: jsonElement.fill,
        xPos: jsonElement.xPos,
        yPos: jsonElement.yPos,
        width: jsonElement.width,
        height: jsonElement.height
      };
      return {...super.getElementParamsFromJsonElement(jsonElement), ...params};
    }
  }


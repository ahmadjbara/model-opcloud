  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmVisualEntity extends OpmVisualElement {
    fill: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;

    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.fill = params.fill;
      this.xPos = params.xPos;
      this.yPos = params.yPos;
      this.width = params.width;
      this.height = params.height;
    }
    getParams() {
      const params =  {
        xPos: this.xPos,
        yPos: this.yPos,
        width: this.width,
        height: this.height,
        fill: this.fill,
      };
      return {...super.getElementParams(), ...params};
    }
  }


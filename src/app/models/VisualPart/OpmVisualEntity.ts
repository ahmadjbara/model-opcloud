  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmVisualEntity extends OpmVisualElement {
    strokeColor: string;
    fill: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    textFontWeight: number;
    constructor(params) {
      super(params);
      this.strokeColor = params.fill;
      this.fill = params.fill;
      this.xPos = params.xPos;
      this.yPos = params.yPos;
      this.width = params.width;
      this.height = params.height;
      this.textFontWeight = params.textFontWeight;
    }
  }


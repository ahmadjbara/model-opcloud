  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmVisualEntity extends OpmVisualElement {
    fill: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;

    constructor(params) {
      super(params);
      this.fill = params.fill;
      this.xPos = params.xPos;
      this.yPos = params.yPos;
      this.width = params.width;
      this.height = params.height;
    }
  }


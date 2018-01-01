  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmVisualEntity extends OpmVisualElement {
    fill: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    private _fatherObject;

    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    get fatherObject() {
      return this._fatherObject;
    }
    set fatherObject(value) {
      this._fatherObject = value;
    }
    getEntityParams() {
      const params =  {
        xPos: this.xPos,
        yPos: this.yPos,
        width: this.width,
        height: this.height,
        fill: this.fill,
        fatherObjectId: this.fatherObject ? (this.fatherObject.id ? this.fatherObject.id : this.fatherObject) : null
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
      if (this.logicalElement) {
        const father = this.logicalElement.opmModel.getVisualElementById(params.fatherObjectId);
        this.fatherObject = father ? father : params.fatherObjectId;
      }
    }
    getEntityParamsFromJsonElement(jsonElement) {
      const params =  {
        fill: jsonElement.fill,
        xPos: jsonElement.xPos,
        yPos: jsonElement.yPos,
        width: jsonElement.width,
        height: jsonElement.height,
        fatherObjectId: jsonElement.fatherObjectId
      };
      return {...super.getElementParamsFromJsonElement(jsonElement), ...params};
    }
  }


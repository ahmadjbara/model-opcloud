  import {OpmVisualElement} from './OpmVisualElement';

  export class OpmVisualEntity extends OpmVisualElement {
    fill: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    private _fatherObject;
    cloneof: OpmVisualEntity;
    inzoomClone: OpmVisualEntity;
    unfoldClone: OpmVisualEntity;

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
        fatherObjectId: this.fatherObject ? (this.fatherObject.id ? this.fatherObject.id : this.fatherObject) : null,
        cloneof: this.cloneof ? this.cloneof.id : null,
        inzoomClone: this.inzoomClone ? this.inzoomClone.id : null,
        unfoldClone: this.unfoldClone ? this.unfoldClone.id : null
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
        this.cloneof = <OpmVisualEntity>(this.logicalElement.opmModel.getVisualElementById(params.cloneof));
        this.inzoomClone = <OpmVisualEntity>(this.logicalElement.opmModel.getVisualElementById(params.inzoomClone));
        this.unfoldClone = <OpmVisualEntity>(this.logicalElement.opmModel.getVisualElementById(params.unfoldClone));
      }
    }
    getEntityParamsFromJsonElement(jsonElement) {
      const params =  {
        fill: jsonElement.fill,
        xPos: jsonElement.xPos,
        yPos: jsonElement.yPos,
        width: jsonElement.width,
        height: jsonElement.height,
        fatherObjectId: jsonElement.fatherObjectId,
        cloneof: jsonElement.cloneof,
        inzoomClone: jsonElement.inzoomClone,
        unfoldClone: jsonElement.unfoldClone
      };
      return {...super.getElementParamsFromJsonElement(jsonElement), ...params};
    }
  }


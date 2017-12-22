  import {OpmVisualEntity} from './OpmVisualEntity';

  export class OpmVisualState extends OpmVisualEntity {
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
    updateParams(params) {
      super.updateParams(params);
      this.fatherObject = this.logicalElement.opmModel.getVisualElementById(params.fatherObjectId);
    }
    getParams() {
      const params = {
        fatherObjectId: this.fatherObject.id
      };
      return {...super.getEntityParams(), ...params};
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        fatherObject: jsonElement.fatherObject
      };
      return {...super.getEntityParamsFromJsonElement(jsonElement), ...params};
    }
  }


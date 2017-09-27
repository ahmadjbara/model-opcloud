  import {OpmVisualEntity} from './OpmVisualEntity';

  export class OpmVisualState extends OpmVisualEntity {
    private _fatherObject;

    constructor(params) {
      super(params);
      this.fatherObject = this.logicalElement.opmModel.getVisualElementById(params.fatherObjectId);
    }
    get fatherObject() {
      return this._fatherObject;
    }

    set fatherObject(value) {
      this._fatherObject = value;
    }
  }


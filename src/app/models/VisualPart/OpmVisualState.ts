  import {OpmVisualEntity} from './OpmVisualEntity';

  export class OpmVisualState extends OpmVisualEntity {

    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
    }
    getParams() {
      return super.getEntityParams();
    }
    getParamsFromJsonElement(jsonElement) {
      return super.getEntityParamsFromJsonElement(jsonElement);
    }
  }


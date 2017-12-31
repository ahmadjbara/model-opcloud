  import {OpmVisualEntity} from './OpmVisualEntity';

  export class OpmVisualThing extends OpmVisualEntity {
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
    }
    getThingParams() {
      const params = {};
      return {...super.getEntityParams(), ...params};
    }
    getThingParamsFromJsonElement(jsonElement) {
      const params = {};
      return {...super.getEntityParamsFromJsonElement(jsonElement), ...params};
    }
  }

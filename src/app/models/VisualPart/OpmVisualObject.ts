  import {OpmVisualThing} from './OpmVisualThing';
  import {statesArrangement} from '../ConfigurationOptions';

  export class OpmVisualObject extends OpmVisualThing {
    statesArrangement: statesArrangement;
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
      this.statesArrangement = this.getStateArrangement(params.statesArrangement);
    }
    getStateArrangement(statesArrangement) {
      switch (statesArrangement) {
        case ('top' || 0):
          return statesArrangement.Top;
        case ('bottom' || 1):
          return statesArrangement.Bottom;
        case ('left' || 2):
          return statesArrangement.Left;
        case ('right' || 3):
          return statesArrangement.Right;
      }
    }
    getParams() {
      const params = {
        statesArrangement: this.statesArrangement
      };
      return {...super.getThingParams(), ...params};
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        statesArrangement: this.getStateArrangement(jsonElement.statesArrangement)
      };
      return {...super.getThingParamsFromJsonElement(jsonElement), ...params};
    }
  }


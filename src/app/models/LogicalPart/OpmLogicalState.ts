  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {OpmVisualState} from '../VisualPart/OpmVisualState';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalState extends OpmLogicalEntity<OpmVisualState> {
    private _stateType: ConfigurationOptions.stateType;
    constructor(params, model) {
      super(params, model);
      this.add(new OpmVisualState(params, this));
    }
    get stateType(): ConfigurationOptions.stateType {
      return this._stateType;
    }
    set stateType(stateType: ConfigurationOptions.stateType) {
      this._stateType = stateType;
    }
    updateParams(params) {
      super.updateParams(params);
    }
    getParams() {
      const visualElementsParams = new Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const params = {
        visualElementsParams: visualElementsParams
      };
      return {...super.getEntityParams(), ...params};
    }
    getParamsFromJsonElement(jsonElement) {
      return super.getEntityParamsFromJsonElement(jsonElement);
    }
  }


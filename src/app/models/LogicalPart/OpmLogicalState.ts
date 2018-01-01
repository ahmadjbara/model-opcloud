  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {OpmVisualState} from '../VisualPart/OpmVisualState';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalState extends OpmLogicalEntity<OpmVisualState> {
    private _stateType;
    constructor(params, model) {
      super(params, model);
      this.add(new OpmVisualState(params, this));
    }
    get stateType(){
      return this._stateType;
    }
    set stateType(stateType) {
      this._stateType = stateType;
    }
    updateParams(params) {
      super.updateParams(params);
      this.stateType = params.stateType;
    }
    getParams() {
      const visualElementsParams = new Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const params = {
        stateType: this.stateType,
        visualElementsParams: visualElementsParams
      };
      return {...super.getEntityParams(), ...params};
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        stateType: jsonElement.stateType
      };
      return {...super.getEntityParamsFromJsonElement(jsonElement), ...params};
    }
  }


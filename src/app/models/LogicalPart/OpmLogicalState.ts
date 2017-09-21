  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {OpmVisualState} from '../VisualPart/OpmVisualState';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalState extends OpmLogicalEntity<OpmVisualState> {
    private _stateType: ConfigurationOptions.stateType;
    // getters and setters
    get stateType(): ConfigurationOptions.stateType {
      return this._stateType;
    }
    set stateType(stateType: ConfigurationOptions.stateType) {
      this._stateType = stateType;
    }
  }


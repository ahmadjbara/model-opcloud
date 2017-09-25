  import {OpmLogicalEntity} from './OpmLogicalEntity';
  import {OpmVisualState} from '../VisualPart/OpmVisualState';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmLogicalState extends OpmLogicalEntity<OpmVisualState> {
    private _stateType: ConfigurationOptions.stateType;
    private fatherObjectId;
    constructor(params) {
      super();
      this.visualElements = new Array<OpmVisualState>();
      this.add(params);
      this.text = OpmLogicalState.stateText;
      this.fatherObjectId = params.fatherObjectId;

    }
    add(params) {
      this.visualElements.push(new OpmVisualState(params));
    }
    // getters and setters
    get stateType(): ConfigurationOptions.stateType {
      return this._stateType;
    }
    set stateType(stateType: ConfigurationOptions.stateType) {
      this._stateType = stateType;
    }
  }


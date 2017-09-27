  import {OpmVisualThing} from './OpmVisualThing';
  import * as ConfigurationOptions from '../ConfigurationOptions';
  import {OpmLogicalObject} from "../LogicalPart/OpmLogicalObject";

  export class OpmVisualObject extends OpmVisualThing {
    statesArrangement: ConfigurationOptions.statesArrangement;
    valueType: ConfigurationOptions.valueType;
    value: any;
    units: string;
    constructor(params) {
      super(params);
      // statesArrangement fro different types. one is string and the new one is enum.
      // Once all states and values related code be refactored the lines should be uncommented
     // this.statesArrangement = params.statesArrangement;
     // this.valueType = params.valueType;
      this.value = params.value;
      this.units = params.units;
    }
  }


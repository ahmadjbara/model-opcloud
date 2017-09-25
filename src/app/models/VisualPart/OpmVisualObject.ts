  import {OpmVisualThing} from './OpmVisualThing';
  import * as ConfigurationOptions from '../ConfigurationOptions';

  export class OpmVisualObject extends OpmVisualThing {
    statesArrangement: ConfigurationOptions.statesArrangement;
    value: any;
    valueState: boolean;
    unitsBrackets: boolean;
    constructor(params){
      super(params);
    }
  }


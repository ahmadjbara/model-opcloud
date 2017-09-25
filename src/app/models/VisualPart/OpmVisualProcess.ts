  import {OpmVisualThing} from './OpmVisualThing';

  export class OpmVisualProcess extends OpmVisualThing {
    parentheses: boolean;
    constructor(params) {
      super(params);
      this.parentheses = params.parentheses;
    }
  }


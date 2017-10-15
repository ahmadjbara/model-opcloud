  import {OpmVisualThing} from './OpmVisualThing';

  export class OpmVisualProcess extends OpmVisualThing {
    parentheses: boolean;
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.parentheses = params.parentheses;
    }
    getParams() {
      const params = {
        parentheses: this.parentheses,
      };
      return {...super.getParams(), ...params};
    }
  }


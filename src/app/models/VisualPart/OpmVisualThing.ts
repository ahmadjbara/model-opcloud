  import {OpmVisualEntity} from './OpmVisualEntity';

  export class OpmVisualThing extends OpmVisualEntity {
    shadow: boolean;
    stroked: boolean;
    constructor(params) {
      super(params);
      this.shadow = params.shadow;
      this.stroked = params.stroked;
    }
  }

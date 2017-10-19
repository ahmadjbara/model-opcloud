  import {OpmVisualThing} from './OpmVisualThing';
  import {OpmVisualElement} from "./OpmVisualElement";

  export class OpmVisualProcess extends OpmVisualThing {
    parentheses: boolean;
    refineable : OpmVisualElement;
    refinee : OpmVisualElement;
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.parentheses = params.parentheses;
    }

    connectRefinementElements(id) {
      (<OpmVisualProcess>this.logicalElement.findVisualElement(id)).refinee = this;
      this.refineable = this.logicalElement.findVisualElement(id);
    }
  }


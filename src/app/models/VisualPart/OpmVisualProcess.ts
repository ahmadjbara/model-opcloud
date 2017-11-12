  import {OpmVisualThing} from './OpmVisualThing';
  import {OpmVisualElement} from "./OpmVisualElement";

  export class OpmVisualProcess extends OpmVisualThing {
    parentheses: boolean;
    refineable : OpmVisualElement;
    refineeInzooming : OpmVisualElement;
    refineeUnfolding: OpmVisualElement;

    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.parentheses = params.parentheses;
    }

    connectRefinementElements(id, type) {
      if (type=='inzoom')
      (<OpmVisualProcess>this.logicalElement.findVisualElement(id)).refineeInzooming = this;
      else
        (<OpmVisualProcess>this.logicalElement.findVisualElement(id)).refineeUnfolding = this;
      this.refineable = this.logicalElement.findVisualElement(id);
    }
  }


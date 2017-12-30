  import {OpmVisualThing} from './OpmVisualThing';
  import {OpmVisualElement} from "./OpmVisualElement";

  export class OpmVisualProcess extends OpmVisualThing {
    refineable: OpmVisualElement;
    refineeInzooming: OpmVisualElement;
    refineeUnfolding: OpmVisualElement;

    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
      let refineable, refineeInzooming, refineeUnfolding;
      if (this.logicalElement && this.logicalElement.opmModel) {
        refineable = this.logicalElement.opmModel.getVisualElementById(params.refineableId);
        refineeInzooming = this.logicalElement.opmModel.getVisualElementById(params.refineeInzoomingId);
        refineeUnfolding = this.logicalElement.opmModel.getVisualElementById(params.refineeUnfoldingId);
      }
      this.refineable = refineable ? refineable : params.refineableId;
      this.refineeInzooming = refineeInzooming ? refineeInzooming : params.refineeInzoomingId;
      this.refineeUnfolding = refineeUnfolding ? refineeUnfolding : params.refineeUnfoldingId;
    }
    getParams() {
      const params = {
        refineableId: this.refineable ? this.refineable.id : null,
        refineeInzoomingId: this.refineeInzooming ? this.refineeInzooming.id : null,
        refineeUnfoldingId: this.refineeUnfolding ? this.refineeUnfolding.id : null
      };
      return {...super.getThingParams(), ...params};
    }
    connectRefinementElements(id, type) {
      if (type=='in-zoom')
      (<OpmVisualProcess>this.logicalElement.findVisualElement(id)).refineeInzooming = this;
      else
        (<OpmVisualProcess>this.logicalElement.findVisualElement(id)).refineeUnfolding = this;
      this.refineable = this.logicalElement.findVisualElement(id);
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        refineableId: jsonElement.refineableId,
        refineeInzoomingId: jsonElement.refineeInzoomingId,
        refineeUnfoldingId: jsonElement.refineeUnfoldingId
      };
      return {...super.getThingParamsFromJsonElement(jsonElement), ...params};
    }
    // in case instead of a reference to an object there is a string (representing object's id),
    // replace the id with the reference to object
    updateComplexityReferences() {
      if (typeof this.refineable === 'string') {
        this.refineable = this.logicalElement.opmModel.getVisualElementById(this.refineable);
      }
      if (typeof this.refineeInzooming === 'string') {
        this.refineeInzooming = this.logicalElement.opmModel.getVisualElementById(this.refineeInzooming);
      }
      if (typeof this.refineeUnfolding === 'string') {
        this.refineeUnfolding = this.logicalElement.opmModel.getVisualElementById(this.refineeUnfolding);
      }
    }
  }


import {OpmStructuralRelation} from './OpmStructuralRelation';
import {OpmTaggedLink} from '../VisualPart/OpmTaggedLink';

export class OpmTaggedRelation extends OpmStructuralRelation<OpmTaggedLink> {
  forwardTag: string;
  backwardTag: string;
  constructor(params, model) {
    super(params, model);
    this.add(new OpmTaggedLink(params, this));
  }
  updateParams(params) {
    super.updateParams(params);
    this.forwardTag = params.forwardTag;
    this.backwardTag = params.backwardTag;
  }
  getParams() {
    const visualElementsParams = new Array();
    for (let i = 0; i < this.visualElements.length; i++) {
      visualElementsParams.push(this.visualElements[i].getParams());
    }
    const params = {
      forwardTag: this.forwardTag,
      backwardTag: this.backwardTag,
      visualElementsParams: visualElementsParams
    };
    return {...super.getStructuredParams(), ...params};
  }
  getParamsFromJsonElement(jsonElement) {
    const params = {
      forwardTag: jsonElement.forwardTag,
      backwardTag: jsonElement.backwardTag,
    };
    return {...super.getStructuralParamsFromJsonElement(jsonElement), ...params};
  }
}

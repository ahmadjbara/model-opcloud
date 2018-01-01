import {OpmStructuralRelation} from './OpmStructuralRelation';
import {OpmFundamentalLink} from '../VisualPart/OpmFundamentalLink';

export class OpmFundamentalRelation extends OpmStructuralRelation <OpmFundamentalLink> {
  constructor(params, model) {
    super(params, model);
    this.add(new OpmFundamentalLink(params, this));
  }
  updateParams(params) {
    super.updateParams(params);
  }
  getParams() {
    const visualElementsParams = new Array();
    for (let i = 0; i < this.visualElements.length; i++) {
      visualElementsParams.push(this.visualElements[i].getParams());
    }
    const params = {
      visualElementsParams: visualElementsParams
    };
    return {...super.getStructuredParams(), ...params};
  }
  getParamsFromJsonElement(jsonElement) {
    return super.getStructuralParamsFromJsonElement(jsonElement);
  }
}

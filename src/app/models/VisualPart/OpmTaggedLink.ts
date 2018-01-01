import {OpmStructuralLink} from './OpmStructuralLink';

export class OpmTaggedLink extends OpmStructuralLink {
  constructor(params, logicalElement) {
    super(params, logicalElement);
  }
  updateParams(params) {
    super.updateParams(params);
  }
  getParams() {
    return super.getStructuralParams();
  }
  getParamsFromJsonElement(jsonElement) {
    return super.getLinkParamsFromJsonElement(jsonElement);
  }
}

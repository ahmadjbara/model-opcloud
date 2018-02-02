import {OpmLink} from './OpmLink';

export class OpmProceduralLink extends OpmLink {
  constructor(params, logicalElement) {
    super(params, logicalElement);
  }
  updateParams(params) {
    super.updateParams(params);
  }
  getParams() {
    return super.getLinkParams();
  }
  getParamsFromJsonElement(jsonElement) {
    return super.getLinkParamsFromJsonElement(jsonElement);
  }
}

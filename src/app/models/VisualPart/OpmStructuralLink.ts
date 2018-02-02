import {OpmLink} from './OpmLink';

export class OpmStructuralLink extends OpmLink {
  constructor(params, logicalElement) {
    super(params, logicalElement);
  }
  updateParams(params) {
    super.updateParams(params);
  }
  getStructuralParams() {
    return super.getLinkParams();
  }
}

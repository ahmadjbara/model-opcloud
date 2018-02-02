import {OpmRelation} from './OpmRelation';
import {OpmStructuralLink} from "../VisualPart/OpmStructuralLink";

export class OpmStructuralRelation<T extends OpmStructuralLink> extends OpmRelation<T> {
  constructor(params, model) {
    super(params, model);
  }
  updateParams(params) {
    super.updateParams(params);
  }
  getStructuredParams() {
    return super.getRelationParams();
  }
  getStructuralParamsFromJsonElement(jsonElement) {
    return super.getRelationParamsFromJsonElement(jsonElement);
  }
}

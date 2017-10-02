import {OpmRelation} from './OpmRelation';
import {OpmStructuralLink} from "../VisualPart/OpmStructuralLink";

export class OpmStructuralRelation<T extends OpmStructuralLink> extends OpmRelation<T> {
  constructor(params, model) {
    super(params, model);
  }
}

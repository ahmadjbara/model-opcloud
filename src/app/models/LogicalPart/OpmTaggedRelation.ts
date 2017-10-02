import {OpmStructuralRelation} from './OpmStructuralRelation';
import {OpmTaggedLink} from "../VisualPart/OpmTaggedLink";

export class OpmTaggedRelation extends OpmStructuralRelation<OpmTaggedLink> {
  forwardTag: string;
  backwardTag: string;
  constructor(params, model) {
    super(params, model);
    this.forwardTag = params.forwardTag;
    this.backwardTag = params.backwardTag;
    this.add(new OpmTaggedLink(params, this));
  }
}

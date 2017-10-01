import {OpmStructuralRelation} from './OpmStructuralRelation';
import {OpmTaggedLink} from "../VisualPart/OpmTaggedLink";

export class OpmTaggedRelation extends OpmStructuralRelation {
  forwardTag: string;
  backwardTag: string;
  constructor(params) {
    super(params);
    this.forwardTag = params.forwardTag;
    this.backwardTag = params.backwardTag;
    this.visualElements = new Array<OpmTaggedLink>();
    this.add(params);
  }
  add(params) {
    this.visualElements.push(new OpmTaggedLink(params));
  }
}

import {OpmStructuralRelation} from './OpmStructuralRelation';
import {OpmFundamentalLink} from '../VisualPart/OpmFundamentalLink';

export class OpmFundamentalRelation extends OpmStructuralRelation {
  constructor(params) {
    super(params);
    this.visualElements = new Array<OpmFundamentalLink>();
    this.add(params);
  }
  add(params) {
    this.visualElements.push(new OpmFundamentalLink(params));
  }
}

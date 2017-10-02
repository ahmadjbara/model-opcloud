import {OpmStructuralRelation} from './OpmStructuralRelation';
import {OpmFundamentalLink} from '../VisualPart/OpmFundamentalLink';

export class OpmFundamentalRelation extends OpmStructuralRelation <OpmFundamentalLink> {
  constructor(params, model) {
    super(params, model);
    this.add(new OpmFundamentalLink(params, this));
  }
}

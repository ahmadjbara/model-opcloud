import {OpmRelation} from './OpmRelation';
import {OpmProceduralLink} from '../VisualPart/OpmProceduralLink';

export class OpmProceduralRelation extends OpmRelation<OpmProceduralLink> {
  pathText: string;
  probability: number;
  rate: number;
  condition: boolean;
  event: boolean;
  constructor(params, model) {
    super(params, model);
    this.condition = params.condition;
    this.event = params.event;
    this.add(new OpmProceduralLink(params, this));
  }
}

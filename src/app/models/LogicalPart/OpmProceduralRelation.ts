import {OpmRelation} from './OpmRelation';
import {OpmProceduralLink} from '../VisualPart/OpmProceduralLink';

class Rate {
  value: number;
  unit: string;
}
export class OpmProceduralRelation extends OpmRelation<OpmProceduralLink> {
  pathText: string;
  probability: number;
  rate: Rate;
  condition: boolean;
  event: boolean;
  constructor(params, model) {
    super(params, model);
    this.condition = params.condition;
    this.event = params.event;
    this.add(new OpmProceduralLink(params, this));
  }
}

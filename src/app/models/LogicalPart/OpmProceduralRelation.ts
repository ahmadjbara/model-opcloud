import {OpmRelation} from './OpmRelation';
import {OpmProceduralLink} from '../VisualPart/OpmProceduralLink';

export class OpmProceduralRelation extends OpmRelation {
  pathText: string;
  probability: number;
  rate: number;
  condition: boolean;
  event: boolean;
  constructor(params) {
    super(params);
    this.condition = params.condition;
    this.event = params.event;
    this.visualElements = new Array<OpmProceduralLink>();
    this.add(params);
  }
  add(params) {
    this.visualElements.push(new OpmProceduralLink(params));
  }
}

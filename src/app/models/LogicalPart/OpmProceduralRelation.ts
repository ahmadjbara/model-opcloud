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
    this.add(new OpmProceduralLink(params, this));
  }
  updateParams(params) {
    super.updateParams(params);
    this.condition = params.condition;
    this.event = params.event;
  }
  getParams() {
    const visualElementsParams = new Array();
    for (let i = 0; i < this.visualElements.length; i++) {
      visualElementsParams.push(this.visualElements[i].getParams());
    }
    const params = {
      condition: this.condition,
      event: this.event,
      visualElementsParams: visualElementsParams
    };
    return {...super.getRelationParams(), ...params};
  }
  getParamsFromJsonElement(jsonElement) {
    const params = {
      condition: jsonElement.condition,
      event: jsonElement.event,
    };
    return {...super.getRelationParamsFromJsonElement(jsonElement), ...params};
  }
}

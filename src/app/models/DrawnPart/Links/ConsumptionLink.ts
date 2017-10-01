import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from "../../ConfigurationOptions";

export  class ConsumptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event) {
    super(sourceElement, targetElement, condition, event);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {fill: 'white', d: 'M 20,33 L 0,25 L 20,17 L 12,25 Z M12,25 L20,25'}});
  }
  getParams() {
    const params = { linkType: linkType.Consumption };
    return {...super.getProceduralLinkParams(), ...params};
  }
}

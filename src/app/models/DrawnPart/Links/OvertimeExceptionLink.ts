import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from "../../ConfigurationOptions";

export  class OvertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event) {
    super(sourceElement, targetElement, condition, event);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {d: 'M30,46 L46,26 M26,36 L50,36'}});
  }
  getParams() {
    const params = { linkType: linkType.OvertimeException };
    return {...super.getProceduralLinkParams(), ...params};
  }
}

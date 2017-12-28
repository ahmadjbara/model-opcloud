import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from "../../ConfigurationOptions";

export  class OvertimeUndertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event) {
    super(sourceElement, targetElement, condition, event);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {d: 'M30,46 L46,26 M40,46 L56,26 M60,46 L76,26 M26,36 L80,36'}});
  }
  getParams() {
    const params = { linkType: linkType.UndertimeOvertimeException };
    return {...super.getProceduralLinkParams(), ...params};
  }
}

import {OpmFundamentalLink} from './OpmFundamentalLink';
import {linkType} from "../../ConfigurationOptions";

export  class InstantiationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../assets/OPM_Links/StructuralSpecify.png';
    this.triangle.attr({image: {'xlink:href': image}});
  }
  getParams() {
    const params = { linkType: linkType.Instantiation };
    return {...super.getFundamentalLinkParams(), ...params};
  }
}

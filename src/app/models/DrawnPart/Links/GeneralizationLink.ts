import {OpmFundamentalLink} from './OpmFundamentalLink';
import {linkType} from "../../ConfigurationOptions";

export  class GeneralizationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../../../assets/icons/OPM_Links/StructuralGeneral.png';
    this.triangle.attr({image: {'xlink:href': image}});
  }
  getParams() {
    const params = { linkType: linkType.Generalization };
    return {...super.getFundamentalLinkParams(), ...params};
  }
}

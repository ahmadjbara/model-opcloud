import {OpmFundamentalLink} from './OpmFundamentalLink';
import {linkType} from "../../ConfigurationOptions";

export  class ExhibitionLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../../../assets/icons/OPM_Links/StructuralExhibit.png';
    this.triangle.attr({image: {'xlink:href': image}});
  }
  getParams() {
    const params = { linkType: linkType.Exhibition };
    return {...super.getFundamentalLinkParams(), ...params};
  }
}

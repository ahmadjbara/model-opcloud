import {OpmFundamentalLink} from './OpmFundamentalLink';
import {linkType} from "../../ConfigurationOptions";

export  class AggregationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../assets/OPM_Links/StructuralAgg.png';
    this.triangle.attr({image: {'xlink:href': image}});
  }
  getParams() {
    const params = { linkType: linkType.Aggregation };
    return {...super.getFundamentalLinkParams(), ...params};
  }
}

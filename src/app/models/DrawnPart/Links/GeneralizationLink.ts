import {OpmFundamentalLink} from './OpmFundamentalLink';

export  class GeneralizationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../assets/OPM_Links/StructuralGeneral.png';
    this.triangle.attr({image: {'xlink:href': image}});

  }
}

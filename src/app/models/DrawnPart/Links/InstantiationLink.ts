import {OpmFundamentalLink} from './OpmFundamentalLink';

export  class InstantiationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../assets/OPM_Links/StructuralSpecify.png';
    this.triangle.attr({image: {'xlink:href': image}});

  }
}

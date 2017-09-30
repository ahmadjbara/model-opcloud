import {OpmFundamentalLink} from './OpmFundamentalLink';

export  class ExhibitionLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph) {
    super(sourceElement, targetElement, graph);
    const image = '../../assets/OPM_Links/StructuralExhibit.png';
    this.triangle.attr({image: {'xlink:href': image}});

  }
}

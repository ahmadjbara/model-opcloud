import {OpmFundamentalLink} from './OpmFundamentalLink';
import {linkType} from "../../ConfigurationOptions";

export  class AggregationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph ,id?:string) {
    super(sourceElement, targetElement, graph ,id);
  //  const image = '../../../../assets/icons/OPM_Links/StructuralAgg.png';
    const SVGAgg = ['<svg xmlns="http://www.w3.org/2000/svg"\n' +
    '     xmlns:se="http://svg-edit.googlecode.com"\n' +
    '   xmlns:xlink="http://www.w3.org/1999/xlink"\n' +
    '   xmlns:dc="http://purl.org/dc/elements/1.1/"\n' +
    '  xmlns:cc="http://creativecommons.org/ns#"\n' +
    '   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n' +
    '   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n' +
    '   width="30" height="30" style="">\n' +
    '  <g class="currentLayer" style="">\n' +
    '<title>Layer 1</title>\n' +
    '<path fill="#000000" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 " style="color: rgb(0, 0, 0);"/>\n' +
    '<path fill="black" stroke="#000000" stroke-width="2" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355875 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z" style="color: rgb(0, 0, 0);" class=""/>\n' +
    '  </g>\n' +
    '</svg>'].join('');

    this.triangle.attr({image: {'xlink:href': 'data:image/svg+xml;utf8,' + encodeURIComponent(SVGAgg)}});


  }
  getParams() {
    const params = { linkType: linkType.Aggregation };
    return {...super.getFundamentalLinkParams(), ...params};
  }
}

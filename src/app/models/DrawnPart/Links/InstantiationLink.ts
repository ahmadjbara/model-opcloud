import {OpmFundamentalLink} from './OpmFundamentalLink';
import {linkType} from "../../ConfigurationOptions";

export  class InstantiationLink extends OpmFundamentalLink {
  constructor(sourceElement, targetElement, graph ,id?:string) {
    super(sourceElement, targetElement, graph ,id);
  //  const image = '../../../../assets/icons/OPM_Links/StructuralSpecify.png';
    const SVGSpecify = ['<svg xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:se="http://svg-edit.googlecode.com"' +
    ' xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/"' +
    ' xmlns:cc="http://creativecommons.org/ns#"' +
    ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
    ' xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ' +
    'width="30" height="30" style=""> ' +
    '<g class="currentLayer" style="">' +
    '<title>Layer 1</title>' +
    '<path fill="#000000" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" id="svg_1" d="M2.5000095926228028,2.500009592622746 " style="color: rgb(0, 0, 0);"/>' +
    '<path fill="white" stroke="#000000" stroke-width="2" stroke-linejoin="round" stroke-dashoffset="" fill-rule="nonzero" marker-start="" marker-mid="" marker-end="" id="svg_3" d="M2.492512550697853,24.97922767453879 L15.327331224413275,0.7604779167355878 L28.162149898128664,24.97922767453879 L2.492512550697853,24.97922767453879 z" style="color: rgb(0, 0, 0);" class=""/>' +
    '<path fill="black" fill-opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="2" stroke-dasharray="none" stroke-linejoin="round" stroke-linecap="butt" stroke-dashoffset="" fill-rule="nonzero" opacity="1" marker-start="" marker-mid="" marker-end="" d="M11.000000238418579,17.390625 C11.000000238418579,14.964865331491712 12.964865422411137,13 15.3906249088217,13 C17.816384395232266,13 19.78124957922482,14.964865331491712 19.78124957922482,17.390625 C19.78124957922482,19.816384668508288 17.816384395232266,21.78125 15.3906249088217,21.78125 C12.964865422411137,21.78125 11.000000238418579,19.816384668508288 11.000000238418579,17.390625 z" id="svg_11" class=""/></g></svg>'].join('');
    this.triangle.attr({image: {'xlink:href': 'data:image/svg+xml;utf8,' + encodeURIComponent(SVGSpecify)}});
  }
  getParams() {
    const params = { linkType: linkType.Instantiation };
    return {...super.getFundamentalLinkParams(), ...params};
  }
}

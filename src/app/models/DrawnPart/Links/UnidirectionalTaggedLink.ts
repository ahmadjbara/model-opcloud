import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';
import {OpmStructuralLink} from './OpmStructuralLink';
import {OpmTaggedLink} from './OpmTaggedLink';
import {linkType} from "../../ConfigurationOptions";

export  class UnidirectionalTaggedLink extends OpmTaggedLink {
  constructor(sourceElement, targetElement ,id?:string) {
    super(sourceElement, targetElement ,id);
   // this.attr({'.marker-source' : {d: ''}});
  //  this.attr({'.marker-target' : {fill: 'white', d: 'M 20,34 L 0,25 L 20,16 M0,25 L20,25'}});
    this.attr('.connection/targetMarker', {
      type: 'polyline', // SVG polyline
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      points:'0,0 20,-10 0,0 20,10'
    });


  }
  getParams() {
    const params = { linkType: linkType.Unidirectional };
    return {...super.getTaggedLinkParams(), ...params};
  }
}

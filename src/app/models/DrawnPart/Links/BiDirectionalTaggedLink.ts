import {OpmTaggedLink} from './OpmTaggedLink';
import {linkType} from '../../ConfigurationOptions';

export class BiDirectionalTaggedLink extends OpmTaggedLink {
  backwardTag: string;
  constructor(sourceElement, targetElement ,id?:string) {
    super(sourceElement, targetElement ,id);
   // this.attr({'.marker-source' : {fill: 'none', d: 'M20,33 L0,23 L20,23'}});
   // this.attr({'.marker-target' : {fill: 'none', d: 'M20,33 L0,23 L20,23'}});


    this.attr('.connection/sourceMarker', {
      type: 'polyline', // SVG polyline
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      points:'0.5,0 20,10'
    });

    this.attr('.connection/targetMarker', {
      type: 'polyline', // SVG polyline
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      points:'0.5,0 20,10'
    });

  }
  getParams() {
    const params = {
      backwardTag: this.backwardTag,
      linkType: linkType.Bidirectional
    };
    return {...super.getTaggedLinkParams(), ...params};
  }
}

import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from "../../ConfigurationOptions";

export  class OvertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event ,id?: string) {
    super(sourceElement, targetElement, condition, event ,id);
   // this.attr({'.marker-source' : {d: ''}});
    //this.attr({'.marker-target' : {d: 'M30,46 L46,26 M26,36 L50,36'}});

    this.attr('.connection/targetMarker', {
      type: 'polyline', // SVG polyline
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
      points:'4,10 13,-10 '
    });
  }
  getParams() {
    const params = { linkType: linkType.OvertimeException };
    return {...super.getProceduralLinkParams(), ...params};
  }
}

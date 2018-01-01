import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from "../../ConfigurationOptions";

export  class ResultLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event ,id?:string) {
    super(sourceElement, targetElement, condition, event ,id);
   // this.attr({'.marker-source' : {d: ''}});
  //  this.attr({'.marker-target' : {fill: 'white', d: 'M 20,33 L 0,25 L 20,17 L 12,25 Z M12,25 L20,25'}});

    this.attr('.connection/targetMarker', {
      type: 'polygon', // SVG polygon
      fill: 'white',
      stroke: 'black',
      'stroke-width': 2,
      points:'0,0 18,8 12,0 18,-8 0,0 '
    });

  }
  getParams() {
      const params = { linkType: linkType.Result };
    return {...super.getProceduralLinkParams(), ...params};
  }
  clone(){
    return new ResultLink(this.sourceElement, this.targetElement, this.condition, this.event);
  }
}

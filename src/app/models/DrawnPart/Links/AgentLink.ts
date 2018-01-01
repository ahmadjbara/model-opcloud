import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from '../../ConfigurationOptions';

export  class AgentLink extends OpmProceduralLink {

  constructor(sourceElement, targetElement, condition, event ,id?:string) {
    super(sourceElement, targetElement, condition, event ,id);
  //  this.attr({'.marker-source' : {d: ''}});
   // this.attr({'.marker-target' : {fill: 'black', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0'}});
    this.attr('.connection/targetMarker', {
      type: 'circle', // SVG Circle
      fill: 'black',
      stroke: 'black',
      r: 5,
      cx: 5
    });
  }
  getParams() {
    const params = { linkType: linkType.Agent };
    return {...super.getProceduralLinkParams(), ...params};
  }
  clone(){
    return new AgentLink(this.sourceElement, this.targetElement, this.condition, this.event);
  }

}

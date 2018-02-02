import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';

export  class OpmStructuralLink extends OpmDefaultLink {
  constructor(id?:string) {
    super(id);
    this.attr({'.connection': {'stroke-dasharray': '0'}});
    this.attr({'.marker-source' : {'stroke-width': 2}});
    this.attr({'.marker-target' : {'stroke-width': 2}});
  }
  getStructuralLinkParams() {
    return super.getDefaultLinkParams();
  }
}

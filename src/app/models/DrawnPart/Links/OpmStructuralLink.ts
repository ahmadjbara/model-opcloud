import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';

export  class OpmStructuralLink extends OpmDefaultLink {
  constructor() {
    super();
    this.attr({'.connection': {'stroke-dasharray': '0'}});
    this.attr({'.marker-source' : {'stroke-width': 2}});
    this.attr({'.marker-target' : {'stroke-width': 2}});

  }
}

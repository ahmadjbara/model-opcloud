import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';
import {OpmStructuralLink} from './OpmStructuralLink';
import {OpmTaggedLink} from './OpmTaggedLink';

export  class BiDirectionalTaggedLink extends OpmTaggedLink {
  backwardTag: string;
  constructor(sourceElement, targetElement) {
    super(sourceElement, targetElement);
    this.attr({'.marker-source' : {fill: 'white', d: 'M20,33 L0,23 L20,23'}});
    this.attr({'.marker-target' : {fill: 'white', d: 'M20,33 L0,23 L20,23'}});
  }
}

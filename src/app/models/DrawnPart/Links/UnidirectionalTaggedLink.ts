import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';
import {OpmStructuralLink} from './OpmStructuralLink';
import {OpmTaggedLink} from './OpmTaggedLink';

export  class UnidirectionalTaggedLink extends OpmTaggedLink {
  constructor(sourceElement, targetElement) {
    super(sourceElement, targetElement);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {fill: 'white', d: 'M 20,34 L 0,25 L 20,16 M0,25 L20,25'}});
  }
}

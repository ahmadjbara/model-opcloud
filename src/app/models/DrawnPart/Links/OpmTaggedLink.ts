import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';
import {OpmStructuralLink} from './OpmStructuralLink';

export  class OpmTaggedLink extends OpmStructuralLink {
  sourceElement: OpmEntity;
  targetElement: OpmEntity;
  forwardTag: string;
  constructor(sourceElement, targetElement) {
    super();
    this.sourceElement = sourceElement;
    this.targetElement = targetElement;
    this.set({'source': {'id': sourceElement.id}});
    this.set({'target': {'id': targetElement.id}});
  }
}

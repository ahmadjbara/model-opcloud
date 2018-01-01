import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';
import {OpmStructuralLink} from './OpmStructuralLink';


export  class OpmTaggedLink extends OpmStructuralLink {
  sourceElement: OpmEntity;
  targetElement: OpmEntity;
  forwardTag: string;
  backwardTag : string ;

  constructor(sourceElement, targetElement ,id?:string) {
    super(id);
    this.sourceElement = sourceElement;
    this.targetElement = targetElement;
    this.set({'source': {'id': sourceElement.id}});
    this.set({'target': {'id': targetElement.id}});

  }

  getTaggedLinkParams() {
    const params = {
      forwardTag: this.forwardTag,
      backwardTag : this.backwardTag
    };
    return {...super.getStructuralLinkParams(), ...params};
  }


}

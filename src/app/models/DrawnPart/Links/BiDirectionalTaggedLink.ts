import {OpmTaggedLink} from './OpmTaggedLink';
import {linkType} from '../../ConfigurationOptions';

export class BiDirectionalTaggedLink extends OpmTaggedLink {
  backwardTag: string;
  constructor(sourceElement, targetElement) {
    super(sourceElement, targetElement);
    this.attr({'.marker-source' : {fill: 'white', d: 'M20,33 L0,23 L20,23'}});
    this.attr({'.marker-target' : {fill: 'white', d: 'M20,33 L0,23 L20,23'}});
  }
  getBiDirectionalTaggedLinkParams() {
    const params = {
      backwardTag: this.backwardTag,
      linkType: linkType.Bidirectional
    };
    return {...super.getTaggedLinkParams(), ...params};
  }
}

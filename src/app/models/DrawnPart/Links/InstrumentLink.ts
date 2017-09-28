import {OpmProceduralLink} from './OpmProceduralLink';

export  class InstrumentLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event) {
    super(sourceElement, targetElement, condition, event);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {fill: 'white', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0'}});
  }
}

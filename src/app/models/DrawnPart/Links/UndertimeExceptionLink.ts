import {OpmProceduralLink} from './OpmProceduralLink';

export  class UndertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event) {
    super(sourceElement, targetElement, condition, event);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {d: 'M30,46 L46,26 M40,46 L56,26 M26,36 L60,36'}});
  }
}

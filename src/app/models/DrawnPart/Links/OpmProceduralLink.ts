
import {OpmDefaultLink} from './OpmDefaultLink';
import {OpmEntity} from '../OpmEntity';

export  class OpmProceduralLink extends OpmDefaultLink {
  sourceElement: OpmEntity;
  targetElement: OpmEntity;
  condition: boolean;
  event: boolean;
  pathText: string;
  probability: number;
  rate: number;
  constructor(sourceElement, targetElement, condition, event ,id?:string) {
    super(id);
    this.sourceElement = sourceElement;
    this.targetElement = targetElement;
    this.condition = condition;
    this.event = event;
    this.set({'source': {'id': typeof sourceElement != 'undefined'? this.sourceElement.id: ''}});
    this.set({'target': {'id': typeof targetElement != 'undefined'? this.targetElement.id: ''}});
    this.attr({'.connection': {'stroke-dasharray': '0'}});
    this.attr({'.marker-source' : {'stroke-width': 2}});
    this.attr({'.marker-target' : {'stroke-width': 2}});
    this.UpdateConditionEvent();
  }
  UpdateVertices() {  }
  UpdateConditionEvent() {
    let symbolAdding: string = this.condition ? 'c' : (this.event ? 'e' : '');
    if (symbolAdding !== '') {    // The link is condition or event link
      const xDiff = this.targetElement.get('position').x - this.sourceElement.get('position').x;
      const yDiff = this.targetElement.get('position').y - this.sourceElement.get('position').y;
      if (xDiff === 0) {
        symbolAdding = symbolAdding + '      ';
      } else if (yDiff === 0) {
        symbolAdding = symbolAdding + '\n\n';
      } else {
        const coeff = yDiff / xDiff;
        if (xDiff > 0) {
          if (coeff >= 1) {
            symbolAdding = '    ' + symbolAdding + '\n';
          } else if (0 < coeff && coeff < 1) {
            symbolAdding = '  ' + symbolAdding + '\n\n';
          } else if (-1 < coeff && coeff < 0) {
            symbolAdding = symbolAdding + '      \n';
          } else if (coeff <= -1) {
            symbolAdding = symbolAdding + '      ';
          }
        }else {  // xDiff < 0
          if (coeff >= 1) {
            symbolAdding = '      ' + symbolAdding;
          } else if (0 < coeff && coeff < 1) {
            symbolAdding = '      ' + symbolAdding + '\n';
          } else if (-1 < coeff && coeff < 0) {
            symbolAdding = symbolAdding + '  \n\n';
          } else if (coeff <= -1) {
            symbolAdding = symbolAdding + '      \n';
          }
        }
      }
      this.set('labels', [{position: -5, attrs: {text: {text: symbolAdding}, rect: {fill: 'transparent'}}}]);
    }
  }
  getProceduralLinkParams() {
    const params = {
      pathText: this.pathText,
      probability: this.probability,
      rate: this.rate
    };
    return {...super.getDefaultLinkParams(), ...params};
  }
}

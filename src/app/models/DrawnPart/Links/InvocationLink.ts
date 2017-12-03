import {OpmProceduralLink} from './OpmProceduralLink';
import {linkType} from "../../ConfigurationOptions";

export  class InvocationLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event) {
    super(sourceElement, targetElement, condition, event);
    this.attr({'.marker-source' : {d: ''}});
    this.attr({'.marker-target' : {fill: 'white', d: 'M 20,33 L 0,25 L 20,17 L 12,25 Z M12,25 L20,25'}});
    this.UpdateVertices();
  }
  UpdateVertices() {
    const srcX = this.sourceElement.get('position').x;
    const srcY = this.sourceElement.get('position').y;
    const dstX = this.targetElement.get('position').x;
    const dstY = this.targetElement.get('position').y;
    // create the orthogonal vector to draw the link
    const vector = {x: dstX - srcX, y: dstY - srcY};
    const vectorLength = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    const x = vector.x / vectorLength;
    const y = vector.y / vectorLength;
    vector.x = -y;
    vector.y = x;
    this.set('vertices', [
      { x: 0.45 * (srcX + 10 * vector.x) + 0.55 * (dstX + 10 * vector.x) + 45, y: 0.45 * (srcY + 5 * vector.y) + 0.55 * (dstY + 5 * vector.y) + 25},
      { x: 0.55 * (srcX - 10 * vector.x) + 0.45 * (dstX - 10 * vector.x) + 45, y: 0.55 * (srcY - 5 * vector.y) + 0.45 * (dstY - 5 * vector.y) + 25}
    ]);
  }
  getParams() {
    const params = { linkType: linkType.Invocation};
    return {...super.getProceduralLinkParams(), ...params};
  }
  clone(){
    return new InvocationLink(this.sourceElement, this.targetElement, this.condition, this.event);
  }
}

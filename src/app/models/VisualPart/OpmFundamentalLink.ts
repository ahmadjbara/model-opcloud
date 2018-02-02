import {OpmStructuralLink} from './OpmStructuralLink';

export class OpmFundamentalLink extends OpmStructuralLink {
  // The vertices on the connection from the entity to the triangle
  private UpperConnectionVertices: Array<{x: number, y: number}>;
  // Triangle position
  private symbolPos: [number, number];
  constructor(params, logicalElement) {
    super(params, logicalElement);
  }
  updateParams(params) {
    super.updateParams(params);
    this.symbolPos = params.symbolPos;
    this.UpperConnectionVertices = params.UpperConnectionVertices;
  }
  getParams() {
    const params = {
      symbolPos: this.symbolPos,
      UpperConnectionVertices: this.UpperConnectionVertices
    };
    return {...super.getStructuralParams(), ...params};
  }
  getParamsFromJsonElement(jsonElement) {
    const params = {
      symbolPos: jsonElement.symbolPos,
      UpperConnectionVertices: jsonElement.UpperConnectionVertices
    };
    return {...super.getLinkParamsFromJsonElement(jsonElement), ...params};
  }
}

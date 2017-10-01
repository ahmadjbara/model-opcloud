import {OpmStructuralLink} from './OpmStructuralLink';

export class OpmFundamentalLink extends OpmStructuralLink {
  // The vertices on the connection from the entity to the triangle
  private UpperConnectionVertices: Array<{x: number, y: number}>;
  // Triangle position
  private symbolPos: [number, number];
  constructor(params) {
    super(params);
    this.symbolPos = params.symbolPos;
    this.UpperConnectionVertices = params.UpperConnectionVertices;
  }
}

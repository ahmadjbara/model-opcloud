import {OpmStructuralLink} from './OpmStructuralLink';

export class OpmFundamentalLink extends OpmStructuralLink {
  // The vertices on the connection from the entity to the triangle
  private UpperConnectionVertices: Array<Array<[number, number]>>;
  // Triangle position
  private symbolPos: [number, number];
}

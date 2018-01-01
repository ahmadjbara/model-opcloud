import {Position} from "./RelationLinks";

export class LinkInstance{
  OPD : string;
  source_id: string;
  destination_id: string;
  Visible : boolean = true;
  trianglePosition : Position;
  breakPoints : Array<Position>;

  constructor(OPD: string,  source_id: string, destination_id: string, Visible ?: boolean ,
              trianglePosition?:Position,breakPoints ?: Array<Position>) {
    this.OPD = OPD;
    this.source_id = source_id;
    this.destination_id = destination_id;
    this.Visible = Visible;
    this.trianglePosition = trianglePosition;
    this.breakPoints = breakPoints;
  }
}


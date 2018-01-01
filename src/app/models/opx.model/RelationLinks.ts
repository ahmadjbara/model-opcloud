/**
 * Created by ta2er on 8/18/2017.
 */
import {LinkInstance} from "./LinkInstance";

export class RelationLinks {
  id: string;
  uuid: string;
  name: string;
  source_id: string;
  source_uuid: string;
  destination_id: string;
  destination_uuid: string;
  forwardRelationMeaning: string;
  backwardRelationMeaning: string;
  InRoot : boolean = false;
  instances : Array<LinkInstance>;
  trianglePosition : Position;
  breakPoints : Array<Position>;



  constructor(id: string,uuid: string, name: string , src_id: string,
              src_uuid: string,des_id: string,des_uuid: string,
              forwardRelationMeaning?:string,backwardRelationMeaning?:string,instances ?:Array<LinkInstance>,
              trianglePosition?:Position,breakPoints ?: Array<Position> ,InRoot?:boolean){
   this.id = id;
   this.uuid = uuid;
   this.name = name;
    this.source_id = src_id;
    this.source_uuid = src_uuid;
    this.destination_id = des_id;
    this.destination_uuid = des_uuid;
    this.forwardRelationMeaning = forwardRelationMeaning;
    this.backwardRelationMeaning = backwardRelationMeaning;
    this.breakPoints = breakPoints;
    this.trianglePosition = trianglePosition;
    this.InRoot = InRoot;
    this.setInstances(instances);

  }

  setInstances(instances : Array<LinkInstance>){
    this.instances = instances;
  }

}

export class Position{
  x:number ;
  y:number ;
  constructor(x:any,y:any){
    this.x = x;
    this.y = y;
  }
}



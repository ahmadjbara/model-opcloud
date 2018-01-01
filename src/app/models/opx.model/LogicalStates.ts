/**
 * Created by ta2er on 8/18/2017.
 */
import {LogicalEntity} from "./LogicalEntity";
import {ThingInstance} from "./ThingInstance";

export class LogicalState {
  id: string;
  uuid: string;
  name: string ;
  enviromental: boolean ;
  physical: boolean;
  x:number;
  y:number;
  width:number;
  height:number;
  default_ : boolean;
  final_ : boolean;
  initial_ : boolean;
  InRoot : boolean = false;
  instances : Array<ThingInstance>;


  constructor(id: string,uuid: string, name: string ,enviromental: boolean ,physical: boolean, x:number, y:number,
  width:number, height:number, default_ : boolean, final_ : boolean, initial_ : boolean ,instances ?: Array<ThingInstance> ,
              InRoot?:boolean){
    this.id=id;
    this.uuid = uuid;
    this.name = name;
    this.enviromental = enviromental;
    this.physical = physical;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.default_ = default_;
    this.final_ = final_;
    this.initial_ = initial_;
    this.InRoot = InRoot;
    this.setInstances(instances);
  }
  setInstances(instances : Array<ThingInstance>){
    this.instances = instances;
  }
}

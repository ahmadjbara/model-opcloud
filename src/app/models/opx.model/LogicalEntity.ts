/**
 * Created by ta2er on 8/18/2017.
 */
import {LogicalState} from "./LogicalStates";
import {ThingInstance} from "./ThingInstance";

export class LogicalEntity{
  id: string;
  uuid: string;
  name: string;
  enviromental: boolean;
  physical: boolean;
  x:number;
  y:number;
  width:number;
  height:number;
  States : Array<LogicalState>;
  SubElements : Array<LogicalEntity>;
  instances : Array<ThingInstance>;
  InRoot : boolean  = true;

  constructor(id: string, uuid: string, name: string, enviromental: boolean,
              physical: boolean, x: number, y: number,
              width: number, height: number,
              states ?: Array<LogicalState> , instances ?: Array<ThingInstance> ,SubElements ?:Array<LogicalEntity>) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.enviromental = enviromental;
    this.physical = physical;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.setStates(states);
    this.setInstances(instances);
    this.setSubElements(SubElements);
    this.setInRoot(x);

  }

  setStates(states : Array<LogicalState>){
    this.States = states;
  }
  setInstances(instances : Array<ThingInstance>){
    this.instances = instances;
  }
  setSubElements(SubElements : Array<LogicalEntity>){
    this.SubElements = SubElements;
  }
  setInRoot(x){
    if(!x){
      this.InRoot = false;
    }
  }



}



export class ThingInstance{
  OPD : string;
  x:number;
  y:number;
  width:number;
  height : number;
  Visible : boolean = true;
  MainEntity : boolean = false;
  child : boolean = false;


  constructor(OPD: string, x?: number, y?: number, width?: number,
              height?: number , MainEntity ?: boolean,child ?:boolean,Visible ?: boolean ) {
    this.OPD = OPD;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.MainEntity = MainEntity;
    this.child = child;
    this.Visible = Visible;
  }
}

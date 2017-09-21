const joint=require('rappid');

var MO = joint.dia.Element.extend();

export class MyObj extends joint.shapes.basic.Rect {

  initialize(){
    super.initialize();
   this.set('position', { x: 100, y: 30 });
   this.set('size', { width: 100, height: 30 });
   this.set('attrs', { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'black' } });
   console.log(this);
  }
}



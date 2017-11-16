import {OpmEntity} from './OpmEntity';
import {arrangeEmbedded} from '../../configuration/elementsFunctionality/arrangeStates';
import {joint, _, paddingObject} from '../../configuration/rappidEnviromentFunctionality/shared';
import {min} from "rxjs/operator/min";
const $ = require('jquery');

export  class OpmState extends OpmEntity {
  constructor(stateName = 'State') {
    super();
    this.set(this.stateAttributes());
    this.attr(this.stateAttrs(stateName));
  }
  stateAttributes() {
    return {
      markup: '<image/><g class="rotatable"><g class="scalable"><rect class="outer"/><rect class="inner"/></g><text/></g>',
      type: 'opm.State',
      size: {width: 60, height: 30},
      minSize: {width: 60, height: 30},
      'father': null,
    };
  }
  innerOuter() {
    const param = {
      stroke: '#808000',
      rx: 5,
      ry: 5,
    };
    return {...this.entityShape(), ...param};
  }
  createInner() {
    return {
      'stroke-width': 0 ,
      width: 60,
      height: 30,
      'ref-x': .5, 'ref-y': .5,
      'x-alignment' : 'middle' ,
      'y-alignment' :  'middle',
    };
  }
  createOuter() {
    return{
      width: 70,
      height: 40,
    };
  }
  stateAttrs(stateName) {
    return {
      '.outer': {...this.innerOuter(), ...this.createOuter()},
      '.inner': {...this.innerOuter(), ...this.createInner()},
      'text' : {text: stateName, 'font-weight': 300},
      'image': {'xlink:href' : '../../../assets/icons/OPM_Links/DefaultState.png',display:'none', 'ref-x': 1, 'ref-y':1,  x: -18, y: -18,ref: 'rect', width: 25, height: 25 }
    };
  }
  getParams() {
    const params = {
      fill: this.attr('rect/fill'),
      strokeColor: this.attr('rect/stroke'),
      strokeWidth: this.attr('rect/stroke-width'),
      fatherObjectId: this.get('father')
    };
    return {...super.getEntityParams(), ...params};
  }
  changeSizeHandle() {
    super.changeSizeHandle();
    // Need to update the size of it's object so that the state will not
    // stay out of it's border
    const parentId = this.get('parent');
    const parent = this.graph.getCell(parentId);
    parent.updateSizeToFitEmbeded();
    // update inner and outer frames size
    const width = this.get('size').width;
    const height = this.get('size').height;
    const diff = Math.max(0.15 * width, 0.15 * height);
    this.attr('.inner', {width: this.get('size').width, height: this.get('size').height});
    this.attr('.outer', {width: (this.get('size').width + diff), height: (this.get('size').height + diff)});
  }
  changePositionHandle() {
    super.changePositionHandle();
    // When state is changing it's position, the object need to change it's size accordingly
    const parentId = this.get('parent');
    const parent = this.graph.getCell(parentId);
    parent.updateSizeToFitEmbeded();
  }
  removeHandle(options) {
    const fatherObject = options.graph.getCell(this.get('father'));
    if (fatherObject.get('embeds').length === 0) {
      fatherObject.arrangeEmbededParams(0.5, 0.5, 'middle', 'middle', 'bottom', 0, 0);
      fatherObject.updateTextAndSize();
      // if the state was a value of the object then delete the value from the object
      if (fatherObject.attr('value/value')) {
        fatherObject.attr({value: {value: 'None'}});
        fatherObject.set('previousValue', null);
        fatherObject.set('logicalValue', null);
      }
    } else {
      arrangeEmbedded(fatherObject, fatherObject.attr('statesArrange'));
    }
  }
  checktype() {
    if(this.attr('.inner/stroke-width') === 0 &&
      this.attr('.outer/stroke-width') === 2 &&
      this.attr('image/display') ==='none'){
      return 'none';
    }
    if(this.attr('.inner/stroke-width') === 0 &&
      this.attr('.outer/stroke-width') === 2 &&
      this.attr('image/display') ==='flex'){
      return 'Default';
    }
    if(this.attr('.inner/stroke-width') === 0 &&
      this.attr('.outer/stroke-width') === 3 &&
      this.attr('image/display') ==='none'){
      return 'Initial';
    }
    if(this.attr('.inner/stroke-width') === 2 &&
      this.attr('.outer/stroke-width') === 2 &&
      this.attr('image/display') ==='none'){
      return 'Final';
    }
    if(this.attr('.inner/stroke-width') === 0 &&
      this.attr('.outer/stroke-width') === 3 &&
      this.attr('image/display') ==='flex'){
      return 'DefInitial';
    }
    if(this.attr('.inner/stroke-width') === 2 &&
      this.attr('.outer/stroke-width') === 2 &&
      this.attr('image/display') ==='flex'){
      return 'DefFinal';
      }
    if(this.attr('.inner/stroke-width') === 2 &&
      this.attr('.outer/stroke-width') === 3 &&
      this.attr('image/display') ==='none'){
      return 'finInitial'
    }
    if(this.attr('.inner/stroke-width') === 2 &&
      this.attr('.outer/stroke-width') === 3 &&
      this.attr('image/display') ==='flex'){
      return 'all';
    }

  }

  haloConfiguration(halo, options) {
    halo.addHandle(this.addHandleGenerator('add_state', 'sw', 'Click to define state type', 'right'));
    var Dcheckbox = '$(\'#Default\').prop(\'checked\',false)';
    var Icheckbox = '$(\'#Initial\').prop(\'checked\',false)';
    var Fcheckbox = '$(\'#Final\').prop(\'checked\',false)';
    if(this.attr('image/display') ==='flex'){
      Dcheckbox = '$(\'#Default\').prop(\'checked\',true)';
    }
    if(this.attr('.outer/stroke-width') === 3){
      Icheckbox = '$(\'#Initial\').prop(\'checked\',true)';
    }
    if( this.attr('.inner/stroke-width') === 2){
      Fcheckbox = '$(\'#Final\').prop(\'checked\',true)';
    }
    halo.on('action:add_state:pointerup', function () {
      const haloThis = this;
      const cellModel = haloThis.options.cellView.model;
      function checker(Dchecked,Ichecked,Fchecked){
        if(!Dchecked && !Ichecked && !Fchecked){
          cellModel.attr('image/display','none');
          cellModel.attr('.inner/stroke-width', 0);
          cellModel.attr('.outer/stroke-width', 2);
          return '000';
        }
        if(!Dchecked && !Ichecked && Fchecked){
          cellModel.attr('image/display','none');
          cellModel.attr('.inner/stroke-width', 2);
          cellModel.attr('.outer/stroke-width', 2);
          return '001';
        }
        if(!Dchecked && Ichecked && !Fchecked){
          cellModel.attr('image/display','none');
          cellModel.attr('.inner/stroke-width', 0);
          cellModel.attr('.outer/stroke-width', 3);
          return '010';
        }
        if(!Dchecked && Ichecked && Fchecked){
          cellModel.attr('image/display','none');
          cellModel.attr('.inner/stroke-width', 2);
          cellModel.attr('.outer/stroke-width', 3);
          return '011';
        }
        if (Dchecked && !Ichecked && !Fchecked) {
          cellModel.attr('image/display','flex');
          cellModel.attr('.inner/stroke-width', 0);
          cellModel.attr('.outer/stroke-width', 2);
          return '100';
        }
        if(Dchecked && !Ichecked && Fchecked){
          cellModel.attr('image/display','flex');
          cellModel.attr('.inner/stroke-width', 2);
          cellModel.attr('.outer/stroke-width', 2);
          return '101';
        }

        if(Dchecked && Ichecked && !Fchecked){
          cellModel.attr('image/display','flex');
          cellModel.attr('.inner/stroke-width', 0);
          cellModel.attr('.outer/stroke-width', 3);
          return '110';
        }
        if(Dchecked && Ichecked && Fchecked){
          cellModel.attr('image/display','flex');
          cellModel.attr('.inner/stroke-width', 2);
          cellModel.attr('.outer/stroke-width', 3);
          return '111';
        }
      }

      (new joint.ui.Popup({
        events: {
          'click .Default': function toggleCheckboxD() {
              // access properties using this keyword
            var Dchecked = (<HTMLInputElement>document.getElementById("Default")).checked;
            var Ichecked =  (<HTMLInputElement>document.getElementById("Initial")).checked;
            var Fchecked =  (<HTMLInputElement>document.getElementById("Final")).checked;
            checker(Dchecked,Ichecked,Fchecked);


          },
          'click .Initial': function toggleCheckboxI() {
            // access properties using this keyword
            var Dchecked = (<HTMLInputElement>document.getElementById("Default")).checked;
            var Ichecked =  (<HTMLInputElement>document.getElementById("Initial")).checked;
            var Fchecked =  (<HTMLInputElement>document.getElementById("Final")).checked;
            checker(Dchecked,Ichecked,Fchecked);

          },
          'click .Final': function toggleCheckboxF() {
            // access properties using this keyword
            var Dchecked = (<HTMLInputElement>document.getElementById("Default")).checked;
            var Ichecked =  (<HTMLInputElement>document.getElementById("Initial")).checked;
            var Fchecked =  (<HTMLInputElement>document.getElementById("Final")).checked;
            checker(Dchecked,Ichecked,Fchecked);

          },
        },

        content: [
          '<form>',
          '<input id="Default" class="Default" name="Default" type="checkbox"> <label for="Default">Default</label>',
          '<input  id="Initial" class="Initial" name="Initial" type="checkbox"> <label for="Initial">Initial</label>',
          '<input id="Final" class="Final" name="Final" type="checkbox" > <label for="Final">Final</label>',
          '</form>',
          '<script>',
          Dcheckbox,
          '</script>',
          '<script>',
          Icheckbox,
          '</script>',
          '<script>',
          Fcheckbox,
          '</script>'
        ].join(''),

        target: halo.el,
        autoClose: true,
      })).render();
    });

  }
}

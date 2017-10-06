import * as common from '../../common/commonFunctions';

const entityText = {
  fill: 'black',
  'font-size': 14,
  'ref-x': .5,
  'ref-y': .5,
  'x-alignment': 'middle',
  'y-alignment': 'middle',
  'font-family': 'Arial, helvetica, sans-serif',
};

const entityDefinition = {
  defaults: common._.defaultsDeep({
    size: {width: 90, height: 50},
    attrs: {
      'text': entityText,
      'wrappingResized' : false,
      'manuallyResized' : false,
    }
  }, common.joint.shapes.basic.Generic.prototype.defaults),
};

export class OpmEntity extends common.joint.dia.Element.extend(entityDefinition) {
  lastEnteredText: string;
  entityShape() {
    return {
      fill: '#DCDCDC',
      magnet: true,
      'stroke-width': 2,
    };
  }
  getEntityParams() {
    return {
      xPos: this.get('position').x,
      yPos: this.get('position').y,
      width: this.get('size').width,
      height: this.get('size').height,
      textFontWeight: this.attr('text/font-weight'),
      textFontSize: this.attr('text/font-size'),
      textFontFamily: this.attr('text/font-family'),
      textColor: this.attr('text/fill'),
      text: this.attr('text/text'),
      id: this.get('id')
    };
  }
  doubleClickHandle(cellView, evt, paper) {
    common.joint.ui.TextEditor.edit(evt.target, {
      cellView: cellView,
      textProperty: 'attrs/text/text',
      placeholder: true
    });
    this.lastEnteredText = cellView.model.attr('text/text');
    this.blankClickHandle(paper);
  }
  blankClickHandle(paper) {
    paper.on('blank:pointerdown', function (cellView, evt) {
      if (this.attr('text/text') === '') {
        this.attr({ text: { text: this.lastEnteredText } });
      }
      common.joint.ui.TextEditor.close();
    }, this);
  }
}

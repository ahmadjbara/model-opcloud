import * as common from '../../common/commonFunctions';
import {textWrapping} from "../../rappid-components/rappid-main/textWrapping";

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
  changeAttributesHandle() {
    if ((this.attr('text/text') !== this.lastEnteredText) &&
        !this.attr('wrappingResized')) {  // if the text was changed
      const textString = this.attr('text/text');
      // No empty name is allowed
      let newParams = { width: this.get('minSize').width, height: this.get('minSize').height, text: '' };
      if (textString.trim() !== '') { // If there is areal text - not spaces
        newParams = textWrapping.calculateNewTextSize(textString, this);
      }
      this.attributes.attrs.wrappingResized = true;
      this.attr({ text: { text: newParams.text } });
      if (!((newParams.width <= this.get('size').width) && (newParams.height <= this.get('size').height) && this.attr('manuallyResized'))) {
        this.resize(newParams.width, newParams.height, {cameFrom: 'textEdit', wd: this.get('size').width, hg: this.get('size').height });
        this.attributes.attrs.manuallyResized = false;
      }
      this.attributes.attrs.wrappingResized = false;
    }
  }
  changeSizeHandle() {
    if (this.attributes.attrs.text && !this.attributes.attrs.wrappingResized) { // resized manually
      textWrapping.wrapTextAfterSizeChange(this);
    }
  }
}

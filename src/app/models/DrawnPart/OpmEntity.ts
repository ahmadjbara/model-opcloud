import {textWrapping} from '../../configuration/elementsFunctionality/textWrapping';
import {OpmProceduralLink} from './Links/OpmProceduralLink';
import {haloConfig} from '../../configuration/rappidEnviromentFunctionality/halo.config';
import {joint, _} from '../../configuration/rappidEnviromentFunctionality/shared';
import {OpmEntityRappid} from './OpmEntityRappid';

const entityText = {
  fill: '#000000',
  'font-size': 14,
  'ref-x': .5,
  'ref-y': .5,
  'x-alignment': 'middle',
  'y-alignment': 'middle',
  'font-family': 'Arial, helvetica, sans-serif',
};

export class OpmEntity extends OpmEntityRappid {
  constructor() {
    super();
    this.set(this.entityAttributes());
    this.attr(this.enitiyAttrs());
  }
  entityAttributes() {
    return {
      size: {width: 90, height: 50}
    };
  }
  enitiyAttrs() {
    return {
      'text': entityText,
      'wrappingResized' : false,
      'manuallyResized' : false
    };
  }
  entityShape() {
  return {
    fill: '#ffffff',
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
  addHandleGenerator(handleName, handlePosition, handleTooltip, handleTooltipPosition) {
    return {
      name: handleName, position: handlePosition, icon: null, attrs: {
        '.handle': {
          'data-tooltip-class-name': 'small',
          'data-tooltip': handleTooltip,
          'data-tooltip-position': handleTooltipPosition,
          'data-tooltip-padding': 15
        }
      }
    };
  }
  haloConfiguration(halo, options) {
    const thisEntity = this;
    halo.addHandle(this.addHandleGenerator('configuration', 'se', 'Click to configure value', 'right'));
    halo.on('action:configuration:pointerup', function () {
      const contextToolbar = thisEntity.contexToolbarGenerator(halo.el, thisEntity.getConfigurationTools()).render();
      thisEntity.configurationContextToolbarEvents(halo.el, contextToolbar);
    });
  }
  contexToolbarGenerator(target, tools) {
    return new joint.ui.ContextToolbar({
      theme: 'modern',
      tools: tools,
      target: target,
      padding: 30
    });
  }
  popupGenerator(target, content, events) {
    return new joint.ui.Popup({
      events: events,
      content: content,
      target: target
    });
  }
  getConfigurationTools() {
    return [{ action: 'styling',  content: 'Styling'}];
  }
  configurationContextToolbarEvents(target, contextToolbar) {
    const thisEntity = this;
    contextToolbar.on('action:styling', function() {
      this.remove();
      const stylePopupContent = ['Text color: <input type="color" class="textColor" value=' + thisEntity.attr('text/fill') + '><br>',
        'Shape fill: <input type="color" class="shapeColor" value=' + thisEntity.getShapeFillColor() + '><br>',
        'Shape outline: <input type="color" class="shapeOutline" value=' + thisEntity.getShapeOutline() + '><br>',
        'Text font size: <input size="2" class="textFontSize" value=' + thisEntity.attr('text/font-size') + '><br>',
        '<button class="btnUpdate">Update</button>'];
      const stylePopupEvents = { 'click .btnUpdate': function() {
          thisEntity.attr({text: {fill: this.$('.textColor').val()}});
          thisEntity.attr({text: {'font-size': this.$('.textFontSize').val()}});
          thisEntity.updateFilter({fill: this.$('.shapeColor').val()});
          thisEntity.updateFilter({'stroke': this.$('.shapeOutline').val()});
          this.remove(); }};
      thisEntity.popupGenerator(target, stylePopupContent, stylePopupEvents).render();
    });
  }
  doubleClickHandle(cellView, evt, paper) {
    joint.ui.TextEditor.edit(evt.target, {
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
      joint.ui.TextEditor.close();
    }, this);
  }
  pointerUpHandle(cellView, options) {
    if (!options.selection.collection.contains(cellView.model)) {
      new joint.ui.FreeTransform({
        cellView: cellView,
        allowRotation: false,
        preserveAspectRatio: false,
        allowOrthogonalResize: true,
      }).render();
      const halo = new joint.ui.Halo({
        cellView: cellView,
        type: 'surrounding',
        handles: haloConfig.handles
      }).render();
      this.haloConfiguration(halo, options);
      options.selection.collection.reset([]);
      options.selection.collection.add(this, { silent: true });
    }
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
    this.updatecomputationalPart();
  }
  updatecomputationalPart() {}
  changeSizeHandle() {
    if (this.attributes.attrs.text && !this.attributes.attrs.wrappingResized) { // resized manually
      textWrapping.wrapTextAfterSizeChange(this);
    }
  }
  changePositionHandle() {
    // When an entity is moving, need to update the vertices on invocation link and the
    // C and E signs on condition end event links
    const outboundLinks = this.graph.getConnectedLinks(this, { outbound: true });
    const inboundLinks = this.graph.getConnectedLinks(this, { inbound: true });
    _.each(outboundLinks.concat(inboundLinks), function (linkToUpdate) {
      if (linkToUpdate instanceof OpmProceduralLink) {
        linkToUpdate.UpdateVertices();
        linkToUpdate.UpdateConditionEvent();
      }
    });
  }
  updateTextAndSize() {
    const newParams = textWrapping.calculateNewTextSize(this.attr('text/text'), this);
    if (newParams.text !== this.attr('text/text')) {
      this.attr({text: {text: newParams.text}});
    }
    if ((newParams.width !== this.get('size').width) || (newParams.height !== this.get('size').height)) {
      this.resize(newParams.width, newParams.height);
    }
  }
  removeHandle(options) {}
  addHandle(options) {}
}

import {OpmEntity} from './OpmEntity';
import { Essence, Affiliation } from '../ConfigurationOptions';
import {joint, _, paddingObject} from '../../configuration/rappidEnviromentFunctionality/shared';

export  class OpmThing extends OpmEntity {
  constructor() {
    super();
    this.set(this.thingAttributes());
    this.attr({text: {'font-weight': 600}});
    this.attr({value: {'value': 'None', 'valueType': 'None', 'units': ''}});
  }

  thingShape() {
    return {
      filter: {name: 'dropShadow', args: {dx: 3, dy: 3, blur: 0, color: 'grey'}},
      'stroke-dasharray': '0',
      width: 90,
      height: 50,
    };
  }
  thingAttributes() {
    return {
    //  size: {width: 90, height: 50},
      minSize: {width: 90, height: 50},
      statesWidthPadding: 0,
      statesHeightPadding: 0,
      value: {'value': 'None', 'valueType': 'None', 'units': ''}
    };
  }
  getThingParams() {
    const params = {
      essence: (this.attr('ellipse/filter/args/dx') === 0) ? Essence.Informatical : Essence.Physical,
      affiliation: (this.attr('ellipse/stroke-dasharray') === 0) ? Affiliation.Systemic : Affiliation.Environmental,
    };
    return {...super.getEntityParams(), ...params};
  }
  // Function gets cell and update the default configuration in the all fields that embeded cells arrangement used.
  arrangeEmbededParams(refX, refY, alignX, alignY, arrangeState, stateWidthPadding, statesHeightPadding) {
    this.attr({text: {'ref-x': refX}});
    this.attr({text: {'ref-y': refY}});
    this.attr({text: {'x-alignment': alignX}});
    this.attr({text: {'y-alignment': alignY}});
    this.attr({'statesArrange': arrangeState});
    this.set('statesWidthPadding', stateWidthPadding);
    this.set('statesHeightPadding', statesHeightPadding);
  }
  // Function updateSizeToFitEmbeded Update the size of the object so that no embedded cell will exceed the father border with
  // padding of 10p.
  updateSizeToFitEmbeded() {
    let leftSideX = this.get('position').x;
    let topSideY = this.get('position').y;
    let rightSideX = this.get('position').x + this.get('size').width;
    let bottomSideY = this.get('position').y + this.get('size').height;

    _.each(this.getEmbeddedCells(), function(child) {
      const childBbox = child.getBBox();
      // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object
      if (childBbox.x <= (leftSideX + paddingObject)) { leftSideX = childBbox.x - paddingObject; }
      if (childBbox.y <= (topSideY + paddingObject)) { topSideY = childBbox.y - paddingObject; }
      if (childBbox.corner().x >= rightSideX - paddingObject) { rightSideX = childBbox.corner().x + paddingObject; }
      if (childBbox.corner().y >= bottomSideY - paddingObject) { bottomSideY = childBbox.corner().y + paddingObject; }
    });
    this.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }});
  }
  pointerUpHandle(cellView, options) {
    super.pointerUpHandle(cellView, options);
    const paper = cellView.paper;
    // When the dragged cell is dropped over another cell, let it become a child of the
    // element below.
    const cellViewsBelow = paper.findViewsFromPoint(this.getBBox().center());
    const currentCellId = this.id;
    if (cellViewsBelow.length) {
    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
    const cellViewBelow = _.find(cellViewsBelow, function (c) {
      return c.model.id !== currentCellId;
    });
    // Prevent recursive embedding.
    if (cellViewBelow && cellViewBelow.model.get('parent') !== currentCellId) {
      cellViewBelow.model.embed(this);
      /* Ahmad commented this line because it blocks the pointerdblclick event
         for the subprocesses of in-zoomed process. It was replaced by
         another line that roughly does the same functionality as toFront.
      */
      // cell.toFront();
      this.set('z', cellViewBelow.model.attributes.z  + 1);
      cellViewBelow.model.updateSizeToFitEmbeded();
    }
    }
  }
  haloConfiguration(halo, options) {
    const thisThing = this;
    halo.addHandle(this.addHandleGenerator('configuration', 'se', 'Click to configure value', 'right'));
    halo.on('action:configuration:pointerup', function () {
      const contextToolbar = thisThing.configurationToolbar(halo).render();
      contextToolbar.on('action:value', function() {
        this.remove();
        thisThing.valuePopup(halo);
      });
      contextToolbar.on('action:essence', function() {
        this.remove();
        const essenceToolbar = thisThing.essenceAffiliationToolbar(halo, 'Physical', 'Informatical').render();
        essenceToolbar.on('action:Physical', function () {
          thisThing.updateFilter({filter: {args: {dx: 3, dy: 3, blur: 0, color: 'grey'}}});
        });
        essenceToolbar.on('action:Informatical', function () {
          thisThing.updateFilter({filter: {args: {dx: 0, dy: 0, blur: 0, color: 'grey'}}});
        });
      });
      contextToolbar.on('action:affiliation', function() {
        this.remove();
        const affiliationToolbar = thisThing.essenceAffiliationToolbar(halo, 'Systemic', 'Environmental').render();
        affiliationToolbar.on('action:Systemic', function () {
          thisThing.updateFilter({'stroke-dasharray': '0'});
        });
        affiliationToolbar.on('action:Environmental', function () {
          thisThing.updateFilter({'stroke-dasharray': '10,5'});
        });
      });
      contextToolbar.on('action:styling', function() {
        this.remove();
        thisThing.stylePopup(halo);
      });
    });
  }
  configurationToolbar(halo) {
    return new joint.ui.ContextToolbar({
      theme: 'modern',
      tools: [
        { action: 'value', content: 'Computation' },
        { action: 'essence', content: 'Essence' },
        { action: 'affiliation', content: 'Affiliation' },
        { action: 'styling',  content: 'Styling'}
      ],
      target: halo.el,
      padding: 30
    });
  }
  essenceAffiliationToolbar(halo, firstData, secondData) {
    return new joint.ui.ContextToolbar({
      theme: 'modern',
      tools: [
        { action: firstData, content: firstData},
        { action: secondData, content: secondData},
      ],
      target: halo.el,
      padding: 30
    });
  }
  stylePopup(halo) {
    const thingThis = this;
    const popup = new joint.ui.Popup({
      events: {
        'click .btnUpdate': function() {
          thingThis.attr({text: {fill: this.$('.textColor').val()}});
          thingThis.attr({text: {'font-size': this.$('.textFontSize').val()}});
          thingThis.updateFilter({fill: this.$('.shapeColor').val()});
          thingThis.updateFilter({'stroke': this.$('.shapeOutline').val()});
          this.remove();
        }
      },
      content: ['Text color: <input type="color" class="textColor" value=' + thingThis.attr('text/fill') + '><br>',
        'Shape fill: <input type="color" class="shapeColor" value=' + thingThis.getShapeFillColor() + '><br>',
        'Shape outline: <input type="color" class="shapeOutline" value=' + thingThis.getShapeOutline() + '><br>',
        'Text font size: <input size="2" type="text" class="textFontSize" value=' + thingThis.attr('text/font-size') + '><br>',
        '<button class="btnUpdate">Update</button>'],
      target: halo.el
    }).render();
  }
}

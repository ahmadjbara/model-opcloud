import {OpmEntity} from './OpmEntity';
import { Essence, Affiliation } from '../ConfigurationOptions';
import * as common from '../../common/commonFunctions';

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
    const padding = this.get('padding');

    common._.each(this.getEmbeddedCells(), function(child) {
      const childBbox = child.getBBox();
      // Updating the new size of the object to have margins of at least paddingObject so that the state will not touch the object
      if (childBbox.x <= (leftSideX + padding)) { leftSideX = childBbox.x - padding; }
      if (childBbox.y <= (topSideY + padding)) { topSideY = childBbox.y - padding; }
      if (childBbox.corner().x >= rightSideX - padding) { rightSideX = childBbox.corner().x + padding; }
      if (childBbox.corner().y >= bottomSideY - padding) { bottomSideY = childBbox.corner().y + padding; }
    });
    this.set({
      position: { x: leftSideX, y: topSideY },
      size: { width: rightSideX - leftSideX, height: bottomSideY - topSideY }});
  }
  pointerUpHandle(paper) {
    // When the dragged cell is dropped over another cell, let it become a child of the
    // element below.
    const cellViewsBelow = paper.findViewsFromPoint(this.getBBox().center());
    const currentCellId = this.id;
    if (cellViewsBelow.length) {
    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
    const cellViewBelow = common._.find(cellViewsBelow, function (c) {
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
}

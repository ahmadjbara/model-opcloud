/**
 * Created by olegz on 03-Jun-17.
 */
import * as common from "../common/commonFunctions";
import {gridLayout} from "./gridLayout";
import {width} from "../common/commonFunctions";
const joint = require('rappid');
const paddingObject = common.paddingObject;

export function arrangeStates(side) {
  let options = this.options;
  let fatherObject = options.cellView.model;
  let text = options.paper.findViewByModel(fatherObject).$('text')[0];
  let embeddedStates = fatherObject.getEmbeddedCells();
  let maxWidth = null;
  let maxHeight = null;
  let overText = false;
  let textBBox = null;
  // Transform the textBoundBox into cell coordinates
  textBoundBox();
  // Calculate how much can the text be moved on X - axis
  let refX = ((0.75 - textBBox.width/fatherObject.getBBox().width) > 0.25) ? 0.25 : Math.max(0, (0.75 - textBBox.width/fatherObject.getBBox().width));
  // If the Object has any embedded states
  if (embeddedStates.length) {
    // Find the maximum Height and Width of all the states
    common._.each(embeddedStates, function (child) {
      if (child.getBBox().width > maxWidth) maxWidth = child.getBBox().width;
      if (child.getBBox().height > maxHeight) maxHeight = child.getBBox().height;
    });
    // Set the Height and Width fo every state
    common._.each(embeddedStates, function (child) {
      let originalW = child.getBBox().width;
      let originalH = child.getBBox().height;
      if (originalH != maxHeight && originalH * 2 > maxHeight) {
        child.set({size: {height: maxHeight, width: originalW}});
        originalH = maxHeight;
      }
      if (originalW != maxWidth && originalW * 2 > maxWidth)
        child.set({size: {height: originalH, width: maxWidth}});
    });
    if (side == 'top') {
      //Change the attributes of the object - will be applied when rendered
      fatherObject.attributes.attrs.text["ref-y"] = '0.75';
      fatherObject.attributes.attrs.statesArrange = 'top';
      fatherObject.attributes.attrs.text["ref-x"] = '0.5';
      options.cellView.render();
      textBoundBox();
      gridLayout.layout(embeddedStates, {
        columns: embeddedStates.length,
        columnWidth: maxWidth + 5,
        rowHeight: maxHeight,
        marginY: (fatherObject.getBBox().y + paddingObject),
        marginX: (fatherObject.getBBox().x + fatherObject.getBBox().width * 0.5) - 0.5 * (maxWidth + 5) * embeddedStates.length
      });
      common._.each(embeddedStates, function (child) {
        if (child.getBBox().y + child.getBBox().height >= textBBox.y)
          overText = true;
      });
      if (overText) {
        common._.each(embeddedStates, function (child) {
          child.set({position: {x: child.getBBox().x, y: textBBox.y - textBBox.height - maxHeight}});
        });
        overText = false;
      }
    }
    else if (side == 'bottom') {
      //Change the attributes of the object - will be applied when rendered
      fatherObject.attributes.attrs.text["ref-y"] = '0.25';
      fatherObject.attributes.attrs.statesArrange = 'bottom';
      fatherObject.attributes.attrs.text["ref-x"] = '0.5';
      options.cellView.render();
      textBoundBox();
      gridLayout.layout(embeddedStates, {
        columns: embeddedStates.length,
        columnWidth: maxWidth + 5,
        rowHeight: maxHeight,
        marginY: ((fatherObject.getBBox().y + fatherObject.getBBox().height) - paddingObject) - maxHeight,
        marginX: (fatherObject.getBBox().x + fatherObject.getBBox().width * 0.5) - 0.5 * (maxWidth + 5) * embeddedStates.length
      });
      common._.each(embeddedStates, function (child) {
        if (child.getBBox().y <= textBBox.y + textBBox.height) {
          overText = true;
        }
      });
      if (overText) {
        common._.each(embeddedStates, function (child) {
          child.set({
            position: {
              x: child.getBBox().x,
              y: textBBox.y + textBBox.height + paddingObject / 2
            }
          });
        });
        overText = false;
      }
    }
    else if (side == 'right') {
      if (refX < 0.1){
        common._.each(embeddedStates, function (child) {
          child.set({
            position: {
              x: textBBox.x + textBBox.width,
              y: child.getBBox().y
            }
          });
        });
        refX = ((0.75 - textBBox.width/fatherObject.getBBox().width) > 0.25) ? 0.25 : Math.max(0.1, (0.75 - textBBox.width/fatherObject.getBBox().width));
      }
      fatherObject.attributes.attrs.text["ref-y"] = '0.5';
      fatherObject.attributes.attrs.statesArrange = 'right';
      fatherObject.attributes.attrs.text["ref-x"] = Math.abs(0.5 - refX).toString();
      options.cellView.render();
      textBoundBox();
      gridLayout.layout(embeddedStates, {
        columns: 1,
        rows: embeddedStates.length,
        columnWidth: maxWidth,
        rowHeight: maxHeight + 5,
        marginY: (fatherObject.getBBox().y + fatherObject.getBBox().height * 0.5) - 0.5 * (maxHeight + 5) * embeddedStates.length,
        marginX: ((fatherObject.getBBox().x + fatherObject.getBBox().width) - paddingObject) - maxWidth
      });
      common._.each(embeddedStates, function (child) {
        if (child.getBBox().x <= textBBox.x + textBBox.width)
          overText = true;
      });
      if (overText) {
        common._.each(embeddedStates, function (child) {
          child.set({
            position: {
              x: textBBox.x + textBBox.width + paddingObject,
              y: child.getBBox().y
            }
          });
        });
        overText = false;
      }
    }
    else if (side == 'left') {
      if (refX < 0.1){
        common._.each(embeddedStates, function (child) {
          child.set({
            position: {
              x: textBBox.x - maxWidth,
              y: child.getBBox().y
            }
          });
        });
        refX = ((0.75 - textBBox.width/fatherObject.getBBox().width) > 0.25) ? 0.25 : Math.max(0.05, (0.75 - textBBox.width/fatherObject.getBBox().width));
      }
      fatherObject.attributes.attrs.text["ref-y"] = '0.5';
      fatherObject.attributes.attrs.statesArrange = 'left';
      fatherObject.attributes.attrs.text["ref-x"] = (0.5 + refX).toString();
      options.cellView.render();
      textBoundBox();
      gridLayout.layout(embeddedStates, {
        columns: 1,
        rows: embeddedStates.length,
        columnWidth: maxWidth,
        rowHeight: maxHeight + 5,
        marginY: (fatherObject.getBBox().y + fatherObject.getBBox().height * 0.5) - 0.5 * (maxHeight + 5) * embeddedStates.length,
        marginX: fatherObject.getBBox().x + paddingObject
      });
      common._.each(embeddedStates, function (child) {
        if (child.getBBox().x + child.getBBox().width >= textBBox.x)
          overText = true;
      });
      if (overText) {
        common._.each(embeddedStates, function (child) {
          child.set({
            position: {
              x: textBBox.x - maxWidth - paddingObject,
              y: child.getBBox().y
            }
          });
        });
        overText = false;
      }
    }
    options.cellView.render();
  }
  // Transform the textBoundBox into cell coordinates
  function textBoundBox() {
    text = options.paper.findViewByModel(fatherObject).$('text')[0];
    textBBox = text.getBBox();
    textBBox.x = fatherObject.getBBox().x + fatherObject.getBBox().width * fatherObject.attributes.attrs.text["ref-x"] + textBBox.x;
    textBBox.y = fatherObject.getBBox().y + fatherObject.getBBox().height * fatherObject.attributes.attrs.text["ref-y"] + textBBox.y;
  }
}

import {basicDefinitions} from "./basicDefinitions";
import * as common from "../common/commonFunctions";
import {arrangeStates} from "../config/arrangeStates";
import {OpmState} from "../models/DrawnPart/OpmState";
const joint = require('rappid');

export function addState(fatherObject) {
  fatherObject.objectChangedSize = false;
  const defaultState = new OpmState();
  fatherObject.embed(defaultState);     // makes the state stay in the bounds of the object
  fatherObject.graph.addCells([fatherObject, defaultState]);
  // Placing the new state. By default it is outside the object.
  const xNewState = fatherObject.getBBox().center().x - basicDefinitions.stateWidth / 2;
  const yNewState = fatherObject.getBBox().y + fatherObject.getBBox().height - basicDefinitions.stateHeight - common.paddingObject;
  defaultState.set('father', defaultState.get('parent'));
  if (fatherObject.get('embeds') && fatherObject.get('embeds').length) {
    common._.each(fatherObject.getEmbeddedCells(), function (child) {
      if (!fatherObject.getBBox().containsPoint(child.getBBox().origin()) ||
        !fatherObject.getBBox().containsPoint(child.getBBox().topRight()) ||
        !fatherObject.getBBox().containsPoint(child.getBBox().corner()) ||
        !fatherObject.getBBox().containsPoint(child.getBBox().bottomLeft())) {
        child.set({position: {x: xNewState, y: yNewState}});
      }
    });
  }
  // Add the new state using the current states arrangement
  if (fatherObject.get('embeds').length < 2) {
    arrangeStates(fatherObject, 'bottom');
  } else {
    arrangeStates(fatherObject, fatherObject.attributes.attrs.statesArrange);
  }
}

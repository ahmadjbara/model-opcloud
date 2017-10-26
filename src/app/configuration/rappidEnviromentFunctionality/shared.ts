import {opmStyle} from './inspector/opmStyle';
export const jquery = require('jQuery');
export const _ = require('lodash');
export const paddingObject = 10;
export const joint = require('rappid');
export const width = require('text-width');
export const height = require('text-height');

export function validationAlert(errorMessage) {
  if (errorMessage) {
    const errorBox = new joint.ui.FlashMessage({
      title: 'Validation Error!',
      type: 'alert',
      content: errorMessage
    });
    errorBox.open();
  }
}
// Function CreateSelection. Gets selection type (select or select-box), selection label,
// in which inspector group it should be and the index.
// The function defines options object for selection according to the label.
// The function return selection object.
export function createSelection(selectionType, selectionOptions, selectionLabel, selectionGroup, selectionIndex, selectionDefault = '') {
  return {
    type: selectionType,
    label: selectionLabel,
    defaultValue: selectionDefault,
    options: selectionOptions,
    group: selectionGroup,
    index: selectionIndex
  };
}
// Function CreateColorsObject. Gets label and index and generate a color-plate object in Styling group
export function createColorsObject(colorsLabel, colorsIndex) {
  return {
    type: 'color-palette',
    options: opmStyle.inspectorFont.colorPalette,
    label: colorsLabel,
    group: 'styling',
    index: colorsIndex
  };
}
// Function CreateRangeObject gets minimum and maximum values (default 10 and 40), label and index and generates a range object.
export function createRangeObject(minValue = 10, maxValue = 40, rangeLabel, rangeIndex) {
  return {
    type: 'range',
    min: minValue,
    max: maxValue,
    step: 1,
    unit: 'px',
    label: rangeLabel,
    group: 'styling',
    index: rangeIndex
  };
}
// Function CreateTextContentObject gets text label, text group and index and generates a text box object.
export function createTextContentObject(textLabel, textGroup, textIndex){
  return {
    type: 'content-editable',
    label: textLabel,
    group: textGroup,
    index: textIndex,
  };
}

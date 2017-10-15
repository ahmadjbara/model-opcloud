export const _ = require('lodash');
export const paddingObject = 10;
export const joint = require('rappid');
export const width = require('text-width');
export const height = require('text-height');
export const jquery = require('jquery');

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

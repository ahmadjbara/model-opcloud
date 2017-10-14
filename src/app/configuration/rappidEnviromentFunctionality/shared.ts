import * as common from '../../common/commonFunctions';
export function validationAlert(errorMessage) {
  if (errorMessage) {
    const errorBox = new common.joint.ui.FlashMessage({
      title: 'Validation Error!',
      type: 'alert',
      content: errorMessage
    });
    errorBox.open();
  }
}

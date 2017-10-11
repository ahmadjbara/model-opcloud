import * as common from '../../common/commonFunctions';
import {gridLayout} from '../../config/gridLayout';
import {textWrapping} from './textWrapping';
const joint = require('rappid');

export function arrangeEmbedded(fatherObject, side) {
  const embeddedStates = fatherObject.getEmbeddedCells();
  let maxWidth = null;
  let maxHeight = null;
  // If the Object has any embedded states
  if (embeddedStates.length) {
    // Find the maximum Height and Width of all the states
    common._.each(embeddedStates, function (child) {
      if (child.getBBox().width > maxWidth) maxWidth = child.getBBox().width;
      if (child.getBBox().height > maxHeight) maxHeight = child.getBBox().height;
    });
    // Set the Height and Width fo every state
    common._.each(embeddedStates, function (child) {
      const stateWidth = (child.getBBox().width * 2 > maxWidth) ? maxWidth : child.getBBox().width;
      const stateHeight = (child.getBBox().height * 2 > maxHeight) ? maxHeight : child.getBBox().height;
      child.set({size: {height: stateHeight, width: stateWidth}});
    });

    if ((side === 'top') || (side === 'bottom')) {
      const refY = (side === 'top') ? (maxHeight + 2 * fatherObject.get('padding')) : fatherObject.get('padding');
      fatherObject.arrangeEmbededParams(0.5, refY, 'middle', 'up', side, 0, maxHeight + fatherObject.get('padding')/2);
      fatherObject.updateTextAndSize();
      const marginY = (side === 'top') ? (fatherObject.getBBox().y + fatherObject.get('padding')) : (fatherObject.getBBox().y + fatherObject.getBBox().height - fatherObject.get('padding') - maxHeight);
      gridLayout.layout(embeddedStates, {
        columns: embeddedStates.length,
        rows: 1,
        columnWidth: (maxWidth + 5),
        rowHeight: maxHeight,
        marginX: (fatherObject.getBBox().x + 0.5*(fatherObject.getBBox().width - (maxWidth + 5) * embeddedStates.length)),
        marginY: marginY
      });
    }
    if ((side === 'left') || (side === 'right')) {
      const refX = (side === 'left') ? (maxWidth + 2 * fatherObject.get('padding')) : fatherObject.get('padding');
      fatherObject.arrangeEmbededParams(refX, 0.5, 'left', 'middle', side, maxWidth + fatherObject.get('padding'), 0);
      fatherObject.updateTextAndSize();
      const marginX = (side === 'left') ? (fatherObject.getBBox().x + fatherObject.get('padding')) : (fatherObject.getBBox().x + fatherObject.getBBox().width - fatherObject.get('padding') - maxWidth);
      gridLayout.layout(embeddedStates, {
        columns: 1,
        rows: embeddedStates.length,
        columnWidth: maxWidth,
        rowHeight: (maxHeight + 5),
        marginX: marginX,
        marginY: (fatherObject.getBBox().y + 0.5 * (fatherObject.getBBox().height - (maxHeight + 5) * embeddedStates.length))
      });
    }
  }
}

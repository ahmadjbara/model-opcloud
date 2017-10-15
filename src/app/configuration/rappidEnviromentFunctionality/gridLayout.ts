import {joint, _} from './shared';
const g = joint.g;
joint.layout = joint.layout || {};

export const gridLayout = {
  layout: function(graphOrCells, opt) {
    let elements;
    if (graphOrCells instanceof joint.dia.Graph) {
      elements = graphOrCells.getElements();
    } else {
      elements = graphOrCells;
    }
    // This is not needed anymore.
    graphOrCells = null;
    // Default value = empty object
    opt = opt || {};
    // number of columns
    const columns = opt.columns || 1;
    // shift the element horizontally by a given amount
    const dx = opt.dx || 0;
    // shift the element vertically by a given amount
    const dy = opt.dy || 0;
    // width of a column
    const columnWidth = opt.columnWidth || this._maxDim(elements, 'width') + dx;
    // height of a row
    const rowHeight = opt.rowHeight ||  this._maxDim(elements, 'height') + dy;
    // position the elements in the centre of a grid cell
    const centre = _.isUndefined(opt.centre) || opt.centre !== false;
    // resize the elements to fit a grid cell & preserves ratio
    const resizeToFit = !!opt.resizeToFit;
    const marginX = opt.marginX || 0;
    const marginY = opt.marginY || 0;
    // Wrap all graph changes into a batch.
    // graph.startBatch('layout');
    // iterate the elements and position them accordingly
    _.each(elements, function(element, index) {
      let cx = 0;
      let cy = 0;
      let elementSize = element.get('size');
      if (resizeToFit) {
        let elementWidth = columnWidth - 2 * dx;
        let elementHeight = rowHeight - 2 * dy;
        const calcElHeight = elementSize.height * (elementSize.width ? elementWidth / elementSize.width : 1);
        const calcElWidth = elementSize.width * (elementSize.height ? elementHeight / elementSize.height : 1);
        if (calcElHeight > rowHeight) {
          elementWidth = calcElWidth;
        } else {
          elementHeight = calcElHeight;
        }
        elementSize = { width: elementWidth, height: elementHeight };
        element.set('size', elementSize);
      }
      if (centre) {
        cx = (columnWidth - elementSize.width) / 2;
        cy = (rowHeight - elementSize.height) / 2;
      }
      cx += marginX;
      cy += marginY;
      element.set('position', {
        x: (index % columns) * columnWidth + dx + cx,
        y: Math.floor(index / columns) * rowHeight + dy + cy
      });
    });
    // graph.stopBatch('layout');
  },
  // find maximal dimension (width/height) in an array of the elements
  _maxDim: function(elements, dimension) {
    return _.reduce(elements, function(max, el) { return Math.max(el.get('size')[dimension], max); }, 0);
  }
};

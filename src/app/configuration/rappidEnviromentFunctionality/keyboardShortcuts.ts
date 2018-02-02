import {joint, _} from '../../configuration/rappidEnviromentFunctionality/shared';

// Options - init-rappid service
export function defineKeyboardShortcuts(options) {
  options.keyboard = new joint.ui.Keyboard();
  /*
  options.keyboard.on({
    'ctrl+c': function () {
      // Copy all selected elements and their associated links.
      options.clipboard.copyElements(options.selection.collection, options.graph);
    },
    'ctrl+v': function () {
      const pastedCells = options.clipboard.pasteCells(options.graph, {
        translate: { dx: 20, dy: 20 },
        useLocalStorage: true
      });
      const elements = _.filter(pastedCells, function (cell) {
        return cell.isElement();
      });
      // Make sure pasted elements get selected immediately. options makes the UX better as
      // the user can immediately manipulate the pasted elements.
      options.selection.collection.reset(elements);
    },
    'ctrl+x shift+delete': function () {
      options.clipboard.cutElements(options.selection.collection, options.graph);
    },
    'delete backspace': function (evt) {
      evt.preventDefault();
      options.graph.removeCells(options.selection.collection.toArray());
    },
    'ctrl+z': function () {
      options.commandManager.undo();
      options.selection.cancelSelection();
    },
    'ctrl+y': function () {
      options.commandManager.redo();
      options.selection.cancelSelection();
    },
    'ctrl+a': function () {
      options.selection.collection.reset(options.graph.getElements());
    },
    'ctrl+plus': function (evt) {
      evt.preventDefault();
      options.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
    },
    'ctrl+minus': function (evt) {
      evt.preventDefault();
      options.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
    },
    'keydown:shift': function (evt) {
      options.paperScroller.setCursor('crosshair');
    },
    'keyup:shift': function () {
      options.paperScroller.setCursor('grab');
    }
  }, options);
  */
}

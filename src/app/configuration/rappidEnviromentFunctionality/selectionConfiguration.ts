export const selectionConfiguration = {
  blankPointerdown(options, evt, x, y) {
    // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // Otherwise, initiate paper pan.
    if (options.keyboard.isActive('shift', evt)) {
      options.selection.startSelecting(evt);
    } else {
      options.selection.cancelSelection();
      options.paperScroller.startPanning(evt, x, y);
    }
  },
  cellPointerdown(options, cellView, evt) {
    // Select an element if CTRL/Meta key is pressed while the element is clicked.
    if (options.keyboard.isActive('ctrl meta', evt)) {
      options.selection.collection.add(cellView.model);
    }
  },
  selectionBoxPointerdown(options, cellView, evt) {
    // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
    if (options.keyboard.isActive('ctrl meta', evt)) {
      options.selection.collection.remove(cellView.model);
    }
  }
};

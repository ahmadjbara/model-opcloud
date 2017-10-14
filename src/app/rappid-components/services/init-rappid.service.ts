import { Injectable } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { CommandManagerService } from '../services/command-manager.service';
// treeview imports
import { TreeViewService } from '../../services/tree-view.service';
// popup imports
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {OpmModel} from '../../models/DrawnPart/OpmModel';
import {OpmDefaultLink} from '../../models/DrawnPart/Links/OpmDefaultLink';
import {addHandle} from '../../configuration/elementsFunctionality/graphFunctionality';
import {defineKeyboardShortcuts} from '../../configuration/rappidEnviromentFunctionality/keyboardShortcuts';


const joint = require('rappid');

// TODO: import specific lodash methods
const _ = require('lodash');

@Injectable()
export class InitRappidService {
  cell$ = new BehaviorSubject(null);
  dialog$ = new BehaviorSubject(null);
  graph = null;
  paper;
  commandManager;
  paperScroller;
  private keyboard;
  private clipboard;
  private selection;
  private navigator;
  private opmModel: OpmModel;


  constructor(
    private graphService: GraphService,
    commandManagerService: CommandManagerService,
    private treeViewService: TreeViewService) {
    this.graph = graphService.getGraph();
    this.commandManager = commandManagerService.commandManager;

    joint.setTheme('modern');
    this.initializePaper();
    this.initializeSelection();
    this.initializeNavigator();
    this.initializeTooltips();
    this.initializeEvents();
    // This doesn't work (the event is not caught)
    this.linkHoverEvent();

    this.opmModel = new OpmModel();
    defineKeyboardShortcuts(this);

  }
  // Opl popup dialog when user hovers on a link
  createOplDialog(linkView) {
    const oplDialogComponentRef = {
      type: 'opl',
      instance: {
        link: linkView.model
      }
    };
    this.dialog$.next(oplDialogComponentRef);
  }

  linkHoverEvent() {
    let oplDialog;

    this.paper.on('link:mouseover', (cellView, evt) => {
      this.createOplDialog(cellView);
    //  console.log('mouse over link');
      cellView.highlight();
    });
    this.paper.on('link:mouseleave', (cellView, evt) => {
      oplDialog.close();
      this.dialog$.next('close-opl');
   //   console.log('mouse leave link');
    });
  }
  initializePaper() {
    this.paper = new joint.dia.Paper({
      linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
      width: 1000,
      height: 1000,
      gridSize: 5,
      drawGrid: true,
      model: this.graph,
      defaultLink: new OpmDefaultLink(),
      multiLinks: false,
      selectionCollection: null
    });
    this.paperScroller = new joint.ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: true,
      cursor: 'grab'
    });
    this.paperScroller.render().center();
  }

  initializeSelection() {

    this.clipboard = new joint.ui.Clipboard();
    this.selection = new joint.ui.Selection({paper: this.paper});

    // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // Otherwise, initiate paper pan.
    this.paper.on('blank:pointerdown', function (evt, x, y) {
      if (this.keyboard.isActive('shift', evt)) {
        this.selection.startSelecting(evt);
      } else {
        this.selection.cancelSelection();
        this.paperScroller.startPanning(evt, x, y);
      }

    }, this);

    this.paper.on('cell:pointerdown', function (cellView, evt) {

      // Select an element if CTRL/Meta key is pressed while the element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.add(cellView.model);
        this.paper.selectionCollection = this.selection.collection;
      }

    }, this);

    this.selection.on('selection-box:pointerdown', function (cellView, evt) {
      // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.remove(cellView.model);
        this.paper.selectionCollection = this.selection.collection;
      }
    }, this);

    this.selection.removeHandle('rotate');
  }

  initializeEvents() {
    const _this = this;
    this.paper.on('cell:pointerdblclick', function (cellView, evt) {
      cellView.model.doubleClickHandle(cellView, evt, this.paper); }, this);
    this.paper.on('cell:pointerup', function (cellView) {
      cellView.model.pointerUpHandle(cellView, _this);
      _this.graphService.updateJSON(); }, this);      // save to firebase
    this.paper.on('blank:pointerclick ', function (cellView) {
      _this.graphService.updateJSON();      // save to firebase
    });
    this.graph.on('change:attrs', function (cell) {
      cell.changeAttributesHandle(); }, this);
    this.graph.on('change:size', _.bind(function (cell) {
      cell.changeSizeHandle(); }, this));
    this.graph.on('change:position', _.bind(function (cell) {
      cell.changePositionHandle(); }, this));
    this.graph.on('remove', (cell) => {
      cell.removeHandle(_this); });
    this.graph.on('add', (cell, collection, opt) => {
      addHandle(_this, cell, opt);
      cell.addHandle(_this); });
  }

  initializeNavigator() {
    const navigator = this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false
    });
  }
  initializeTooltips() {
    new joint.ui.Tooltip({
      rootTarget: document.body,
      target: '[data-tooltip]',
      direction: 'auto',
      padding: 10
    });
  }
}

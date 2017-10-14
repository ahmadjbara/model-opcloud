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
import {selectionConfiguration} from "../../configuration/rappidEnviromentFunctionality/selectionConfiguration";


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
    this.initializeDesktop();
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
  initializeDesktop() {
    this.paper = new joint.dia.Paper({
      linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
      width: 1000,
      height: 1000,
      gridSize: 5,
      drawGrid: true,
      model: this.graph,
      defaultLink: new OpmDefaultLink(),
      multiLinks: false,
    });
    this.paperScroller = new joint.ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: true,
      cursor: 'grab'
    });
    this.paperScroller.render().center();
    this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false
    });
    this.clipboard = new joint.ui.Clipboard();
    this.selection = new joint.ui.Selection({paper: this.paper});
    this.selection.removeHandle('rotate');
    new joint.ui.Tooltip({
      rootTarget: document.body,
      target: '[data-tooltip]',
      direction: 'auto',
      padding: 10
    });
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
    this.paper.on('blank:pointerdown', function (evt, x, y) {
      selectionConfiguration.blankPointerdown(this, evt, x, y); }, this);
    this.paper.on('cell:pointerdown', function (cellView, evt) {
      selectionConfiguration.cellPointerdown(this, cellView, evt); }, this);
    this.selection.on('selection-box:pointerdown', function (cellView, evt) {
      selectionConfiguration.selectionBoxPointerdown(this, cellView, evt); }, this);
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
}

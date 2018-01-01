import { Injectable } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { CommandManagerService } from '../services/command-manager.service';
// treeview imports
import { TreeViewService } from './tree-view.service';
// popup imports
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {OpmModel} from '../../models/OpmModel';
import {OpmDefaultLink} from '../../models/DrawnPart/Links/OpmDefaultLink';
import {addHandle, removeHandle} from '../../configuration/elementsFunctionality/graphFunctionality';
import {defineKeyboardShortcuts} from '../../configuration/rappidEnviromentFunctionality/keyboardShortcuts';
import {selectionConfiguration} from '../../configuration/rappidEnviromentFunctionality/selectionConfiguration';
import {InvocationLink} from "../../models/DrawnPart/Links/InvocationLink";
import {OpmFundamentalLink} from '../../models/DrawnPart/Links/OpmFundamentalLink';


const joint = require('rappid');

// TODO: import specific lodash methods
const _ = require('lodash');

@Injectable()
export class InitRappidService {
  cell$ = new BehaviorSubject(null);
  dialog$ = new BehaviorSubject(null);
  graph = null;
  ImportedGraph = null;
  paper;
  commandManager;
  paperScroller;
  private clipboard;
  private selection;
  private navigator;
  private opmModel: OpmModel;


  constructor(
    private graphService: GraphService,
    commandManagerService: CommandManagerService,
    private treeViewService: TreeViewService) {
    this.graph = graphService.getGraph();
    this.ImportedGraph = this.graphService.getImportedGraph();
    this.commandManager = commandManagerService.commandManager;

    joint.setTheme('modern');
    this.initializeDesktop();
    this.initializeEvents(this.graph);
    this.opmModel = new OpmModel();
    defineKeyboardShortcuts(this);
    console.log(this.opmModel);
  }


  getTreeView(){
    return this.treeViewService;
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
      interactive:
        function (cellView) {

          if (cellView.model instanceof InvocationLink) {
            return {
              vertexAdd: false,
              vertexRemove: false,
              vertexMove: false,

            }
          }
          if (cellView.model instanceof OpmFundamentalLink) {
            return {
              arrowheadMove: false,
            }
          }

          return true;
        },


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
    const tooltip = new joint.ui.Tooltip({
      rootTarget: document.body,
      target: '[data-tooltip]',
      direction: 'auto',
      padding: 10
    });
  }
  changeGraphToSD() {
    const sdNodeId = this.treeViewService.nodes[0].id;
    const sdNodeType = this.treeViewService.nodes[0].type;
    this.graphService.changeGraphModel(sdNodeId, this.treeViewService, sdNodeType);
  }
  changeGraphToParent(parentId) {
    const parentNode = this.treeViewService.getNodeById(parentId);
    if (!parentNode) {
      this.changeGraphToSD();
    } else {
      this.graphService.changeGraphModel(parentNode.id, this.treeViewService, parentNode.type);
    }
  }
  initializeEvents(graph?:any) {
    const _this = this;
    this.paper.on('cell:pointerdblclick', function (cellView, evt) {
      cellView.model.doubleClickHandle(cellView, evt, this.paper); }, this);
    this.paper.on('cell:pointerup', function (cellView) {
      cellView.model.pointerUpHandle(cellView, _this);
      _this.graphService.updateJSON(); }, this);      // save to firebase
    this.paper.on('element:pointerup link:options', function (cellView) {
      if (!this.selection.collection.contains(cellView.model)) {
        this.cell$.next(cellView.model); }}, this);
    this.paper.on('blank:pointerclick ', function () {
      _this.graphService.updateJSON();      // save to firebase
    });
    this.paper.on('blank:pointerdown', function (evt, x, y) {
      selectionConfiguration.blankPointerdown(this, evt, x, y); }, this);
    this.paper.on('cell:pointerdown', function (cellView, evt) {
      selectionConfiguration.cellPointerdown(this, cellView, evt); }, this);
    this.selection.on('selection-box:pointerdown', function (cellView, evt) {

      selectionConfiguration.selectionBoxPointerdown(this, cellView, evt); }, this);
    graph.on('change:attrs', function (cell) {
      cell.changeAttributesHandle(); }, this);
    graph.on('change:size', _.bind(function (cell) {
      cell.changeSizeHandle(); }, this));
    graph.on('change:position', _.bind(function (cell) {
      cell.changePositionHandle(); }, this));
    graph.on('remove', (cell) => {
      cell = cell.model || cell;
      removeHandle(_this, cell);
      cell.removeHandle(_this);
      });
    graph.on('add', (cell, collection, opt) => {
      addHandle(_this, cell, opt);
      cell.addHandle(_this);
    });
  }
}

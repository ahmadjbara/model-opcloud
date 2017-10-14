import { Injectable } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { linkTypeSelection } from '../../configuration/elementsFunctionality/linkTypeSelection';
import { CommandManagerService } from '../services/command-manager.service';
//treeview imports
import { TreeViewService } from '../../services/tree-view.service';
// popup imports
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {OpmModel} from "../../models/DrawnPart/OpmModel";
import {OpmDefaultLink} from "../../models/DrawnPart/Links/OpmDefaultLink";
import {addHandle} from "../../configuration/elementsFunctionality/graphFunctionality";


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
  private validator;
  private navigator;
  private RuleSet;
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
    this.initializeKeyboardShortcuts();
    this.initializeTooltips();
    this.initializeEvents();
    this.initializeAttributesEvents();
    // This doesn't work (the event is not caught)
    this.linkHoverEvent();

    this.opmModel = new OpmModel();

  }

  createDialog(link) {
    const dialogComponentRef = {
      type: 'choose-link',
      instance: {
        newLink: link,
        linkSource: link.getSourceElement(),
        linkTarget: link.getTargetElement(),
        opmLinks: linkTypeSelection.generateLinkWithOpl(link),
        Structural_Links: [],
        Agent_Links: [],
        Instrument_Links: [],
        Effect_links: [],
        Consumption_links: [],
        Result_Link: [],
        Invocation_links: [],
        Exception_links: [],
      }
    };

    for (const link of dialogComponentRef.instance.opmLinks) {
      //Structrial Links
      if (link.name == 'Aggregation-Participation'
        || link.name == 'Generalization-Specialization'
        || link.name == 'Exhibition-Characterization'
        || link.name == 'Classification-Instantiation'
        || link.name == 'Unidirectional_Relation'
        || link.name == 'Bidirectional_Relation') {

        dialogComponentRef.instance.Structural_Links.push(link);
      }
      //Agent Links
      else if (link.name == 'Agent' || link.name == 'Event_Agent' || link.name == 'Condition_Agent') {
        dialogComponentRef.instance.Agent_Links.push(link);
      }
      //Instrument links
      else if (link.name == 'Instrument' || link.name == 'Condition_Instrument' || link.name == 'Event_Instrument') {
        dialogComponentRef.instance.Instrument_Links.push(link);
      }
      //Effect links
      else if (link.name == 'Condition_Effect' || link.name == 'Event_Effect' || link.name == 'Effect') {
        dialogComponentRef.instance.Effect_links.push(link);
        dialogComponentRef.instance.Effect_links.reverse();
      }
      //Consumption links
      else if (link.name == 'Consumption' || link.name == 'Condition_Consumption' || link.name == 'Event_Consumption') {
        dialogComponentRef.instance.Consumption_links.push(link);
      }
      //Result
      else if (link.name == 'Result') {
        dialogComponentRef.instance.Result_Link.push(link);
      }
      //Invocation
      else if (link.name == 'Invocation') {
        dialogComponentRef.instance.Invocation_links.push(link);
      }
      //Exception Links
      else if (link.name == 'Overtime_exception' || link.name == 'Undertime_exception') {
        dialogComponentRef.instance.Exception_links.push(link);
      }
    }

    this.dialog$.next(dialogComponentRef);
    return dialogComponentRef;
  }

  //Opl popup dialog when user hovers on a link
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

  initializeKeyboardShortcuts() {

    this.keyboard = new joint.ui.Keyboard();
    this.keyboard.on({

      'ctrl+c': function () {
        // Copy all selected elements and their associated links.
        this.clipboard.copyElements(this.selection.collection, this.graph);
      },

      'ctrl+v': function () {

        const pastedCells = this.clipboard.pasteCells(this.graph, {
          translate: { dx: 20, dy: 20 },
          useLocalStorage: true
        });

        const elements = _.filter(pastedCells, function (cell) {
          return cell.isElement();
        });

        // Make sure pasted elements get selected immediately. This makes the UX better as
        // the user can immediately manipulate the pasted elements.
        this.selection.collection.reset(elements);
      },

      'ctrl+x shift+delete': function () {
        this.clipboard.cutElements(this.selection.collection, this.graph);
      },

      'delete backspace': function (evt) {
        evt.preventDefault();
        this.graph.removeCells(this.selection.collection.toArray());
      },

      'ctrl+z': function () {
        this.commandManager.undo();
        this.selection.cancelSelection();
      },

      'ctrl+y': function () {
        this.commandManager.redo();
        this.selection.cancelSelection();
      },

      'ctrl+a': function () {
        this.selection.collection.reset(this.graph.getElements());
      },

      'ctrl+plus': function (evt) {
        evt.preventDefault();
        this.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
      },

      'ctrl+minus': function (evt) {
        evt.preventDefault();
        this.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
      },

      'keydown:shift': function (evt) {
        this.paperScroller.setCursor('crosshair');
      },

      'keyup:shift': function () {
        this.paperScroller.setCursor('grab');
      }

    }, this);
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
      cellView.model.pointerUpHandle(cellView, _this); }, this);
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

  initializeAttributesEvents() {
    const _this = this;
    this.paper.render();
    this.paper.on('cell:pointerup blank:pointerclick ', function (cellView) {
      _this.graphService.updateJSON();
    });
    this.paper.on('cell:pointerdown', function (cellView) {
      const cell = cellView.model;
      cell.on('cell:pointerup', function (cellView) {
        _this.graphService.updateJSON();
      });
    });
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

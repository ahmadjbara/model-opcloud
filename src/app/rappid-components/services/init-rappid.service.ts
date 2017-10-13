import { Injectable } from '@angular/core';
import { GraphService } from '../services/graph.service';
import { haloConfig } from '../../configuration/rappidEnviromentFunctionality/halo.config';
import { toolbarConfig } from '../../config/toolbar.config';
import { opmRuleSet } from '../../config/opm-validator';
import { linkTypeSelection } from '../../configuration/elementsFunctionality/linkTypeSelection';
import { CommandManagerService } from '../services/command-manager.service';
import { textWrapping } from '../../configuration/elementsFunctionality/textWrapping';
import { arrangeEmbedded } from '../../configuration/elementsFunctionality/arrangeStates';
//treeview imports
import { TreeViewService } from '../../services/tree-view.service';
import { processInzooming, processUnfolding } from '../../config/process-inzooming';
// popup imports
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import {OpmProcess} from "../../models/DrawnPart/OpmProcess";
import {OpmObject} from "../../models/DrawnPart/OpmObject";
import {OpmModel} from "../../models/DrawnPart/OpmModel";
import {OpmLogicalObject} from "../../models/LogicalPart/OpmLogicalObject";
import {OpmLogicalProcess} from "../../models/LogicalPart/OpmLogicalProcess";
import {OpmLogicalState} from "../../models/LogicalPart/OpmLogicalState";
import {OpmState} from "../../models/DrawnPart/OpmState";
import {OpmDefaultLink} from "../../models/DrawnPart/Links/OpmDefaultLink";
import {OpmProceduralLink} from "../../models/DrawnPart/Links/OpmProceduralLink";
import {OpmProceduralRelation} from '../../models/LogicalPart/OpmProceduralRelation';
import {OpmFundamentalLink} from '../../models/DrawnPart/Links/OpmFundamentalLink';
import {OpmFundamentalRelation} from '../../models/LogicalPart/OpmFundamentalRelation';
import {OpmTaggedLink} from '../../models/DrawnPart/Links/OpmTaggedLink';
import {OpmTaggedRelation} from '../../models/LogicalPart/OpmTaggedRelation';


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
    this.initializeValidator();
    this.initializeNavigator();
    this.initializeKeyboardShortcuts();
    this.initializeTooltips();
    this.handleAddLink();
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
  // Check Changes. This function has been modified to update opl for each cell once graph is changed
  handleAddLink() {
    this.graph.on('add', (cell, collection, opt) => {
      if (opt.stencil) {
        this.cell$.next(cell);
      }
      if (cell instanceof OpmObject) {
        this.opmModel.add(new OpmLogicalObject(cell.getParams(), this.opmModel));
      } else if (cell instanceof OpmProcess) {
        this.opmModel.add(new OpmLogicalProcess(cell.getParams(), this.opmModel));
      } else if (cell instanceof OpmState) {
        this.opmModel.add(new OpmLogicalState(cell.getParams(), this.opmModel));
      } else if (cell instanceof OpmProceduralLink) {
        this.opmModel.add(new OpmProceduralRelation(cell.getParams(), this.opmModel));
      } else if (cell instanceof OpmTaggedLink) {
        this.opmModel.add(new OpmTaggedRelation(cell.getParams(), this.opmModel));
      } else if (cell instanceof OpmFundamentalLink) {
        this.opmModel.add(new OpmFundamentalRelation(cell.getParams(), this.opmModel));
      }


      if (cell.attributes.type === 'opm.Link') {
        this.paper.on('cell:pointerup ', function (cellView) {
          const cell = cellView.model;
          //If it is a new link and is not connected to any element - deleting it. Otherwise it will be reconnected to
          //the previous element
          if (cell.isLink() && !cell.attributes.target.id && !cell.get('previousTargetId')) {
            cell.remove();
          }
        });
        cell.on('change:target change:source', (link,a, b) => {

          if (link.attributes.source.id && link.attributes.target.id) {
            if (link.attributes.source.id != link.attributes.target.id) {
              if (!link.get('previousTargetId') || (link.get('previousTargetId') != link.attributes.target.id)) {
                const relevantLinks = linkTypeSelection.generateLinkWithOpl(link);
                if (relevantLinks.length > 0) {
                  link.set('previousTargetId', link.attributes.target.id);
                  if (!b.cameFromInZooming) {
                    this.createDialog(link);
                    console.log("here...");
                  }
                }
              }
            }
          }
        });
      }
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
  initializeValidator() {
    this.validator = new joint.dia.Validator({ commandManager: this.commandManager });
    this.RuleSet = opmRuleSet;
    this.RuleSet(this.validator, this.graph);
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

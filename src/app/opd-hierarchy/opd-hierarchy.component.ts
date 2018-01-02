import { Component, OnInit, ViewChild } from '@angular/core';
import { IActionMapping, KEYS, TREE_ACTIONS, TreeComponent, TreeNode } from 'angular-tree-component';
import { GraphService } from '../rappid-components/services/graph.service';
import { TreeViewService } from '../rappid-components/services/tree-view.service';
import { Node } from '../models/node.model';
import { Subscription } from 'rxjs/Subscription';
import {DomSanitizer} from "@angular/platform-browser"
const joint = require('rappid');

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event)
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};


@Component({
  selector: 'opcloud-opd-hierarchy',
  templateUrl: './opd-hierarchy.component.html',
  styleUrls: ['./opd-hierarchy.component.scss']
})
export class OPDHierarchyComponent implements OnInit {
  subscription: Subscription;
  nodes: Node[] = [];
  @ViewChild(TreeComponent) treeView: TreeComponent;
  private graph;
  showApi = false;
  private ServGraph = new joint.dia.Graph();

  constructor(private graphService: GraphService, public _treeViewService: TreeViewService, private sanitizer: DomSanitizer) {
    this.graph = graphService.getGraph();
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.subscription = this._treeViewService.getNodes().subscribe(nodes => {
      this.nodes = nodes;
      this.treeView.treeModel.update();
    });
    this._treeViewService.treeView = this.treeView;
  }

  customTemplateStringOptions = {
    // displayField: 'subTitle',
    isExpandedField: 'expanded',
    idField: 'id',
    actionMapping,
    nodeHeight: 1,
    allowDrag: true,
    useVirtualScroll: true
  };

  onEvent(event) {
  }

  changeGraphModel($event, node) {
    console.log(node);
    this.graph =  this.graphService.changeGraphModel(node.data.id, this._treeViewService, node.data.type);
    if(node.data.id === 'SD'){
      node.data.graph.resetCells(this.graph.getCells())
    }

    return this
  }
  getNodeSubTitle(node){
    //console.log(node.data.graph.getCell(node.id));
    if (typeof node.data.graph.getCell(node.id) === 'undefined')
      return '';
    else
      return node.data.graph.getCell(node.id).attributes.attrs.text.text + ' '+ node.data.type+'ed';
  }
  getNodeNum(node) {
    let path = node.path;
    if (path.length==1)
      return '';
    let result='';
    for (let k=1; k< path.length; k++) {
      let next = this.treeView.treeModel.getNodeById(path[k]);
      if (result=='')
        result=(next.index+1);
      else
        result = result+'.'+(next.index+1);
    }
    return result;
  }


  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }


  activateSubSub(tree) {
    // tree.treeModel.getNodeBy((node) => node.data.name === 'subsub')
    tree.treeModel.getNodeById(1001)
      .setActiveAndVisible();
  }

  getColorByType(node) {
    if (node.data.type === 'in-zoom') {
      return '2px solid #0000FF';
    }
    if (node.data.type === 'unfold')
      return '2px solid #0096FF';
    return '1px solid #000000';
  }
  addNode(tree){
    this._treeViewService.removeNode(tree.treeModel.getActiveNode().data.id);
    tree.treeModel.update();
  }
}

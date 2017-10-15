import { Injectable } from '@angular/core';
import {Node} from '../models/node.model';
import { GraphService } from '../rappid-components/services/graph.service';

import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/Rx';

import * as _ from 'lodash';
import {TreeComponent} from "angular-tree-component";

const { find } = _;
const rootId="SD";


@Injectable()
export class TreeViewService {
  nodes: Node[] = [];
  private nodesSubject: BehaviorSubject<Node[]> = new BehaviorSubject<Node[]>(this.nodes);
  parentNode: any;

  treeView: TreeComponent;

  constructor(private graphService: GraphService) {

     this.parentNode = new Node({
       className: 'root-class',
       expanded: true,
       children: [],
       id: rootId,
       name: rootId,
       parent: rootId,
       graph: graphService.graph,
     });
    this.nodes.push(this.parentNode);

  }


  getNodes(): Observable<Node[]>{
    return this.nodesSubject.asObservable();
  }

  insertNode(cellModelRef, type)
  {
    let element_id=cellModelRef.id;
    let parent_id=cellModelRef.get('parent')?cellModelRef.get('parent'):rootId;
    let parentNode=this.getNodeById(parent_id);
    var newNode = new Node({
      className: 'root-class',
      expanded: true,
      children: [],
      id: element_id,
      name: 'SD',
      parent: parentNode,
      graph: null,
      type: type,
    });

    let clonedProcess = this.graphService.graphSetUpdate(element_id, newNode, this, type);
    parentNode.addChildren(newNode);
    this.nodesSubject.next(this.nodes);
    return clonedProcess;
  }




  removeNode(nodeId){
    let node=this.getNodeById(nodeId);
    const idStr = nodeId.toString();
   this.removeNodeBy((node) => node.id.toString() === idStr,this.nodes[0],nodeId);
    if (node!=null){
      this.graphService.removeGraphById(nodeId,node.parent.id);
    }

    this.nodesSubject.next(this.nodes);
  }




  getNodeById(id) {
    if (id==rootId)
      return this.nodes[0];
    const idStr = id.toString();
    return this.getNodeBy((node) => node.id.toString() === idStr);
  }
  getNodeByIdType(id, type) {
    if (id==rootId)
      return this.nodes[0];
    const idStr = id.toString();
    return this.getNodeBy((node) => node.id.toString() === idStr && node.type===type);
  }

  getNodeBy(predicate, startNode = this.nodes[0]) {
    startNode = startNode;

    if (!startNode.children) return null;
    const found = find(startNode.children, predicate);
    if (found) { // found in children
      return found;
    } else { // look in children's children
      for (let child of startNode.children) {
        const foundInChildren = this.getNodeBy(predicate, child);
        if (foundInChildren) return foundInChildren;
      }
    }
  }



  removeNodeBy(predicate, startNode = this.nodes[0],childNameToRemove) {
    startNode = startNode;
    if (!startNode.children) return null;
    const found = find(startNode.children, predicate);
    if (found) { // found in children
      startNode.children=startNode.children.filter(function(child){ return child.id !== childNameToRemove});
      return found;
    } else { // look in children's children
      for (let child of startNode.children) {
        const foundInChildren = this.removeNodeBy(predicate, child,childNameToRemove);
        if (foundInChildren) return foundInChildren;
      }
    }
  }



}

